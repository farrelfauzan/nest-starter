import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedAccessError } from 'src/errors/ResourceError';

@Injectable()
export class VerifyLoggedInMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const user: any = req.user;
    try {
      if (!user) UnauthorizedAccessError();
    } catch (err) {
      next(err);
      return;
    }

    next();
    return;
  }
}
