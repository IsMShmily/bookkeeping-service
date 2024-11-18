import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypormFiletr implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let code = 500;

    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }

    res.status(500).json({
      code: code,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
