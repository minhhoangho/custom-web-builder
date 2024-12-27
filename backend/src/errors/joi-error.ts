import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/constants/error-code';
import { ApiError } from './api-error';
import { ErrorOptionInterface } from '@common/interfaces';

export class JoiValidationError extends ApiError {
  constructor(details: any[], _options: ErrorOptionInterface = {}) {
    super({
      title: 'Validation error',
      message: 'Format of the request is not correct.',
      status: HttpStatus.BAD_REQUEST,
      code: ErrorCode.INVALID_PARAMETER,
      errors: details,
    });
  }
}
