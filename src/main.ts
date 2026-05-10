import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //strips away properties that are not in the DTO
      forbidNonWhitelisted: true, //throws error if extra properties are sent
      transform: true, // automatically transforms types (e.g., string to number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
