/* eslint-disable no-underscore-dangle */
import { ErrorCode } from '@common/constants';
import { HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';
import { ApiError } from './api-error';
import { ErrorOptionInterface } from '@common/interfaces';

export class NotFoundError extends ApiError {
  constructor(
    code: string | null = ErrorCode.NOT_FOUND,
    resourceName = 'Entity',
    options: ErrorOptionInterface = {},
  ) {
    if (!code) {
      code = ErrorCode.NOT_FOUND;
    }

    super({
      title: _.get(options, 'title', 'Not found'),
      message: _.get(
        options,
        'message',
        `Not found error: ${resourceName} not found`,
      ),
      status: HttpStatus.NOT_FOUND,
      code,
      errors: _.get(options, 'errors', []),
    });
  }
}
