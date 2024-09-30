import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import moment from 'moment';
import { map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(conteext: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        const { data, count, meta } = response;

        return {
          success: true,
          statustCode: conteext.switchToHttp().getResponse().statusCode,
          data,
          count,
          meta,
        };
      }),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      status: false,
      statusCode: status,
      message: exception.message,
      data: exception,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
}
