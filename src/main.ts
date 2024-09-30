import { NestFactory, Reflector } from '@nestjs/core';
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
import { JwtAuthGuard } from './auth/auth.guard';
import { RequestTimeoutInterceptor } from './interceptors/request-timout.interceptor';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';

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
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
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
  app.useGlobalInterceptors(new RequestTimeoutInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(3000);

  logger.log(`Server running on port 3000`);

  return app;
}

void bootstrap();
