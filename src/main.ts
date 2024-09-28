import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';

const logger = new Logger('bootstrap');

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: ['error', 'warn', 'log'],
      cors: true,
    },
  );

  app.setGlobalPrefix('api');
  app.enable('trust proxy');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useBodyParser('json', { limit: '2mb' });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));

        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  await app.listen(3000);

  logger.log(`Server running on port 3000`);

  return app;
}

void bootstrap();
