import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExpiredAccessTokenError } from 'src/errors/ResourceError';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  public constructor(private readonly reflector: Reflector) {
    super(reflector);
  }

  public handleRequest(err: unknown, user: User): any {
    if (user?.accessToken !== null || user?.refreshToken !== null) return user;

    return false;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const { user }: Request = request;

    if (user) {
      return true;
    }

    return ExpiredAccessTokenError();
  }
}
