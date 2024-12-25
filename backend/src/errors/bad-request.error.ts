/* eslint-disable no-underscore-dangle */
import * as _ from 'lodash';

import { ErrorCode } from '@common/constants';
import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';
import { ErrorOptionInterface } from '@common/interfaces';

export class BadRequestError extends ApiError {
  constructor(
    code: string | null = ErrorCode.BAD_REQUEST,
    options: ErrorOptionInterface = {},
  ) {
    if (!code) {
      code = ErrorCode.BAD_REQUEST;
    }

    super({
      title: _.get(options, 'title', 'Bad request'),
      message: _.get(options, 'message', 'Bad request'),
      status: HttpStatus.BAD_REQUEST,
      code,
      errors: _.get(options, 'errors', []),
    });
  }
}
