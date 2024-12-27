import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private setupRequestId(req: Request) {
    let requestId = req.headers['x-request-id'];
    if (!requestId) {
      requestId = uuidv4();
      // Assign requestId to request.headers with `x-request-id` key so that it is available for injection in downstream
      // controllers/services
      _.set(req, ['headers', 'x-request-id'], requestId);
    }
  }

  use(req: Request, res: Response, next: NextFunction): void {
    // const { ip, method, path: url } = req;
    // const userAgent = req.get('user-agent') || '';
    const { method } = req;

    this.setupRequestId(req);
    // Sensitive field that need to be hided when logging
    const maskedFields = [
      'authorization',
      'firebase_key',
      'api_key',
      'client_secret',
      'client_id',
      'password',
      'credential',
    ];
    const headers = _.mapValues(_.get(req, 'headers', {}), (val, key) => {
      if (maskedFields.includes(key)) return '****';
      return val;
    });

    const body = _.mapValues(_.get(req, 'body', {}), (val, key) => {
      if (maskedFields.includes(key)) return '****';
      return val;
    });

    const requestPayload = JSON.stringify({
      headers,
      body,
    });

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const reqInfo = `PID: ${global.process.pid} FROM: ${req.ip}, ENDPOINT: ${method} ${req.protocol}://${req.hostname}${req.originalUrl}, X_REQUEST_ID: ${req.headers['x-request-id']}`;

    Logger.log(`${reqInfo}, REQUEST_INFO: ${requestPayload}`, 'Request');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const oldEndFn = res.end;
    const chunks: Buffer[] = [];
    res.end = (resBuffer) => {
      if (resBuffer) {
        chunks.push(Buffer.from(resBuffer));
      }
      const resBody = Buffer.concat(chunks).toString('utf8');
      let bodyContent;

      try {
        bodyContent = JSON.parse(resBody);
      } catch (_error) {
        bodyContent = resBody;
      }

      const responsePayload = JSON.stringify({
        status: res.statusCode,
        headers,
        data: bodyContent,
      });

      Logger.log(`${reqInfo}, RESPONSE_INFO: ${responsePayload}`, 'Response');

      return oldEndFn.apply(res, [resBuffer]);
    };

    next();
  }
}
