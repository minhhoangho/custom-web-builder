import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { NotFoundError } from '../../errors';
/**
 * @Usage The custom decorator, used to extract information from JWT token
 */
export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user !== undefined) {
      return request.user;
    }
    throw new NotFoundError(null, 'user');
  },
);
