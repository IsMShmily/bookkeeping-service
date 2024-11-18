// Copyright (c) 2022 toimc<admin@wayearn.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 关闭整个nestjs日志
    // logger: false,
    // logger: ['error', 'warn'],
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.setGlobalPrefix('api/v1');

  const httpAdapter = app.get(HttpAdapterHost);

  const logger = new Logger();
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  // 全局管道拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true,
      // forbidNonWhitelisted: false, // 确保不会因为未知字段抛出错误
      // transform: true,
    }),
  );

  const port = 3000;
  await app.listen(port);
}
bootstrap();
