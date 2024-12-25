import * as _ from 'lodash';

import { ApiErrorInterface } from '@common/interfaces/api-error.interface';
// import { AppSentry } from '@common/third_parties';
import { Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ApiError } from './api-error';
import { MappingError } from './mapping.error';
@Catch()
export class ExceptionHandler extends BaseExceptionFilter {
  constructor(
    // @Inject(AppSentry) private sentry: AppSentry,
    @Inject(MappingError) private mappingError: MappingError,
  ) {
    super();
  }

  catch(exception: ApiError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    let customizedProps = {};

    if (!_.isEmpty(exception.stack) && process.env.NODE_ENV !== 'production') {
      customizedProps = {
        stack: exception.stack,
      };
    }
    const error: ApiErrorInterface = this.mappingError.error(exception);

    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.status(error.status).json({
      ...error,
      ...customizedProps,
    });
    // this.sentry.captureException(exception, request, { request });
  }
}
