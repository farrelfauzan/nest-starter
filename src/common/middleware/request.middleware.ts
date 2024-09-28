import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { z } from 'zod';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: NextFunction) {
    if (!req.body) next();

    try {
      if (req.body && Object.keys(req.body).length > 0) {
        const jsonApiRequestBodySchema = z.object({
          data: z.object({
            type: z.string().optional(),
            attributes: z.object({}),
          }),
        });
        const jsonApiBody = jsonApiRequestBodySchema.parse(req.body);
        req.body = {
          type: jsonApiBody.data.type,
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
