import { PAGINATION_DEFAULT } from '@common/constants';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { get, omit } from 'lodash';
// import { Observable, of } from 'rxjs';
import { Request } from 'express';
import { catchError } from 'rxjs/operators';
import { ApiError } from 'src/errors';
import { AnyObject, FilterMethods } from '@common/constants/types';
import { of } from 'rxjs';

@Injectable()
export abstract class BaseFilter<T>
  implements NestInterceptor, FilterMethods<T>
{
  abstract getWhereCondition(
    conditionFields: AnyObject,
  ): Promise<
    FindOptionsWhere<T>[] | FindOptionsWhere<T> | ObjectLiteral | string
  >;

  public getRelations(): string[] {
    return [];
  }

  public getJoinCondition(): AnyObject {
    return {};
  }

  public getCustomFields() {
    return [];
  }

  private request: Request;

  private async transform(request: Request): Promise<FindManyOptions<T>> {
    let queryInRequest: AnyObject = request.query;
    const pagination = {
      take: get(queryInRequest, 'limit', PAGINATION_DEFAULT.LIMIT),
      skip: get(queryInRequest, 'offset', PAGINATION_DEFAULT.OFFSET),
      order: queryInRequest.order
        ? queryInRequest.order.split(',').reduce((acc, orderField) => {
            if (orderField[0] === '-') acc[orderField.slice(1)] = 'DESC';
            else acc[orderField] = 'ASC';
            return acc;
          }, {})
        : { updatedAt: 'DESC' },
    };

    // Remove fields in req.query
    queryInRequest = omit(queryInRequest, ['limit', 'offset', 'order']);

    let whereCondition = await this.getWhereCondition(queryInRequest);
    const customFields = this.getCustomFields();

    // Remove custom fields in value (req.query)
    if (typeof whereCondition !== 'string') {
      queryInRequest = omit(queryInRequest, customFields);

      whereCondition = {
        ...queryInRequest,
        ...(whereCondition as any),
      };
    }

    const query: FindManyOptions<T> = {
      where: whereCondition,
      ...(pagination as any),
      relations: this.getRelations(),
      join: this.getJoinCondition(),
    };

    return query;
  }

  handleResponse(next: CallHandler<T>): any {
    return next.handle().pipe(
      catchError((error: ApiError): any => {
        const { ip, headers, method, url, query } = this.request;
        Logger.error(
          `${ip} [${headers['x-request-id']}] ${method} ${url}`,
          error.stack,
          { query },
        );

        return of({
          data: [],
          pagination: {
            limit: Number(get(query, 'limit', PAGINATION_DEFAULT.LIMIT)),
            offset: Number(get(query, 'offset', PAGINATION_DEFAULT.OFFSET)),
            total: 0,
          },
          error,
        });
      }),
    );
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Promise<any> {
    this.request = context.switchToHttp().getRequest();
    (this.request as any).query = await this.transform(this.request);

    return this.handleResponse(next);
  }
}
