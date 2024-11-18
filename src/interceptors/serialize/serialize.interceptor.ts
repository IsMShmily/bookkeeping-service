import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private vo: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.vo, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
