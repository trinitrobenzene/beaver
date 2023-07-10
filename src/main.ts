import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log(`App is running at http://127.0.0.1:${port}`);
}
bootstrap();
