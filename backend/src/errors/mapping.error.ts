import * as _ from 'lodash';
import { ErrorCode } from '@common/constants';
import { ApiErrorInterface } from '@common/interfaces/api-error.interface';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { get } from 'lodash';
import { ApiError } from './api-error';
import { UnAuthorizedError } from './unauthorized.error';

export class MappingError {
  error(error: ApiError): ApiErrorInterface {
    let err = error as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const { constructor } = error;

    switch (constructor) {
      case ForbiddenException:
        err = new UnAuthorizedError();
        break;

      case BadRequestException:
        err.status = get(
          err,
          'status',
          get(err, 'response.statusCode'),
        );
        err.title = 'Bad request';
        if (
          _.isArray(get(err, 'response.message')) &&
          _.size(get(err, 'response.message'))
        ) {
          err.message = get(err, 'response.message.0');
          err.errors = get(err, 'response.message', [])
        } else {
          err.message = get(err, 'response.message');
        }
        err.code = ErrorCode.BAD_REQUEST;
        break;
      case NotFoundException:
        err.status = get(err, 'status');
        err.title = 'Not found';
        err.message = get(err, 'response.message');
        err.code = ErrorCode.NOT_FOUND;
        break;
      default:
        break;
    }

    return {
      status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      title: err.title || 'Server error',
      message: err.message || 'Internal server error',
      code: err.code || ErrorCode.INTERNAL_SERVER_ERROR,
      errors: err.errors || [],
    };
  }
}
