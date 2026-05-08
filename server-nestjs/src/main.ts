// File: src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // For DTO validation
import cookieParser from 'cookie-parser';

//import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

//dotenv.config();
// Furure: integrate Swagger auto docs
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //console.log('DB URL in Nest:', process.env.DATABASE_URL);
  // Enable global validation pipe (for DTO validation)
  app.enableCors({
    //origin: process.env.ENABLE_COR,
    origin: 'http://localhost:3001',
    credentials: true,
  }); 


  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
