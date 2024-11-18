import {
  ExceptionFilter,
  HttpAdapterHost,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { ArgumentsHost, Catch } from '@nestjs/common';

import * as requestIp from 'request-ip';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(
      '%c 🐞 ~~ error ：',
      'color:#fff;background:red;border-radius:3px',
      exception['response'],
    );
    const responseBody = {
      // -------------------------------------------------
      // headers: request.headers,
      // query: request.query,
      // body: request.body,
      // params: request.params,
      // 还可以加入一些用户信息
      // IP信息
      // ip: requestIp.getClientIp(request),
      // exceptioin: exception['name'],
      // error: exception['response'] || 'Internal Server Error',
      // -------------------------------------------------
      code: exception['response']['statusCode'] || 500,
      message:
        exception['response']['message'] instanceof Array
          ? exception['response']['message'][0]
          : typeof exception['response']['message'] === 'string'
          ? exception['response']['message']
          : 'Internal Server Error',
      timestamp: new Date().toISOString(),
    };

    this.logger.error('[toimc]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
