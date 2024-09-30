import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { object } from 'yup';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.body) next();

    try {
      if (req.body && Object.keys(req.body).length > 0) {
        const jsonApiRequestBodySchema = object().shape({
          data: object()
            .shape({
              attributes: object().required(),
            })
            .required(),
        });
        const jsonApiBody = jsonApiRequestBodySchema.validateSync(req.body);
        req.body = {
          ...jsonApiBody.data.attributes,
        };
      }
      next();
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST);
      res.send({
        statusCode: HttpStatus.BAD_REQUEST,
        title: 'Request Error',
        message: err?.message || 'Internal Server Error',
      });
    }
  }
}
