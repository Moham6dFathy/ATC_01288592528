import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exceptionFilters/global-exception.filter';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  //Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //Global Exception filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  //Parsers
  app.use(cookieParser(process.env.COOKIES_SECRET_KEY));

  //Handle CORS
  app.enableCors();

  //Helmet
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
