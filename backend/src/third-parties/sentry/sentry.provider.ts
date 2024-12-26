import { ErrorCode } from '@common/constants';
import * as Sentry from '@sentry/node';
import { get, isEmpty } from 'lodash';
import loadConfig from 'src/configs';
import { ApiError } from '../../errors';

export class AppSentry {
  private sendable: boolean;

  constructor() {
    this.sendable = loadConfig.sentry.enable || false;
  }

  allowSendException(error: Error): boolean {
    const errorCodesToSend: string[] = [ErrorCode.INTERNAL_SERVER_ERROR];
    const status = (error as ApiError).status || 500;
    const errorCode = (error as ApiError).code;
    return (
      (this.sendable && status >= 500) || errorCodesToSend.includes(errorCode)
    );
  }

  captureException(error: Error, request?: Request, context = {}) {
    if (this.allowSendException(error)) {
      error.name = error.constructor.name;
      Sentry.captureException(error, (scope) => {
        scope.setTag('error_code', `${get(error, 'code')}`);
        scope.setTag('error_message', `${get(error, 'message')}`);
        scope.setTag('method', get(request, 'method', '-'));
        scope.setTag('endpoint', get(request, 'path', '-'));
        scope.setTag('service_name', get(request, 'service_name', 'base'));
        scope.setTag(
          'request_id',
          get(request, ['headers', 'x-request-id'], '-'),
        );

        if (!isEmpty(context)) {
          scope.setExtra('Request', get(context, 'request', {}));
        }

        return scope;
      });
    }
  }
}
