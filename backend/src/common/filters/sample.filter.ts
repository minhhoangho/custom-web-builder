import { AnyObject } from '@common/constants/types';
import { BaseFilter } from '@common/filters';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { User } from '@app/user/entities/user.entity';

export class SampleFilter extends BaseFilter<User> {
  /**
   * @description
   * USAGES:
   * Use this method to return the where condition in FindManyOptions for each entity
   * - The result will be return in @Query() query: FindManyOptions<T> in controller
   * - Just use it to query with findWithPagination in Base Repository
   */

  async getWhereCondition(
    _conditionFields: AnyObject,
  ): Promise<
    FindOptionsWhere<User>[] | FindOptionsWhere<User> | ObjectLiteral | string
  > {
    return {};
  }

  /**
   * @description
   * USAGES:
   * Use this method when you want to remove the custom field from query after you handle it in getWhereCondition method
   * @returns {string[]}
   */
  getCustomFields(): string[] {
    return [];
  }
}
