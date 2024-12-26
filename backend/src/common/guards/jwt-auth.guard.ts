import { ErrorCode } from '@common/constants';
import { UnAuthorizedError } from 'src/errors';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JSONObject } from '@common/types';
/**
 * Guard will determine whether a given request will be handled by the route handler or not.
 * @Usage This guard is used to custom the JWT AuthGuard for error handling
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: Error, user: JSONObject, info: JSONObject): JSONObject {
    // No token found
    if (info?.message === 'No auth token') {
      throw new UnAuthorizedError(ErrorCode.UNAUTHORIZED, {
        message: 'User is not authorized. You need to log in again.',
      });
    }
    // Token expired
    if (info?.message === 'jwt expired') {
      throw new UnAuthorizedError(ErrorCode.UNAUTHORIZED, {
        message: 'User is not authorized. You need to log in again.',
      });
    }
    // Token is invalid
    if (info?.message) {
      throw new UnAuthorizedError(ErrorCode.UNAUTHORIZED, {
        message: 'User is not authorized. You need to log in again.',
      });
    }
    // No user found with the token
    if (!user) {
      throw new UnAuthorizedError(ErrorCode.UNAUTHORIZED, {
        message: 'Access token invalid',
      });
    }

    return user;
  }
}
