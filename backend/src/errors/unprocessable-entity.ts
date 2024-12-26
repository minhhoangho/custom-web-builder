import * as _ from 'lodash';
import { ErrorCode } from '@common/constants';
import { HttpStatus } from '@nestjs/common';

import { ApiError } from './api-error';
import { ErrorOptionInterface } from '@common/interfaces';

export class UnprocessableEntityError extends ApiError {
  constructor(
    code: string | null = ErrorCode.UNPROCESSABLE_ENTITY,
    resourceName = 'Entity',
    options: ErrorOptionInterface = {},
  ) {
    if (!code) {
      code = ErrorCode.UNPROCESSABLE_ENTITY;
    }

    super({
      title: _.get(options, 'title', 'Unprocessable entity'),
      message: _.get(
        options,
        'message',
        `Unprocessable entity: ${resourceName}`,
      ),
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code,
      errors: _.get(options, 'errors', []),
    });
  }
}
