/* eslint-disable no-underscore-dangle */
import * as _ from 'lodash';
import { ErrorCode } from '@common/constants';
import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';
import { ErrorOptionInterface } from '@common/interfaces';

export class UnAuthorizedError extends ApiError {
  constructor(
    code: string | null = ErrorCode.UNAUTHORIZED,
    options: ErrorOptionInterface = {},
  ) {
    if (!code) {
      code = ErrorCode.UNAUTHORIZED;
    }

    super({
      title: _.get(options, 'title', 'Unauthorized error'),
      message: _.get(options, 'message', 'User is not authenticated'),
      status: HttpStatus.UNAUTHORIZED,
      code,
      errors: _.get(options, 'errors', []),
    });
  }
}
