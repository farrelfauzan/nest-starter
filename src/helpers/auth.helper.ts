import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import moment from 'moment';
import { PassportPayload } from 'src/interfaces/passport.interface';
import { TokenType } from 'src/types/enums';
import { User } from 'src/user/entities/user.entity';
import {
  DecryptFailedError,
  UserNotFoundError,
} from 'src/errors/ResourceError';

@Injectable()
export class AuthHelper {
  private readonly jwt: JwtService;
  private authService: AuthService;

  constructor(jwt: JwtService) {
    this.jwt = jwt;
    this.authService = new AuthService();
  }

  async decode(token: string): Promise<{ [key: string]: any }> {
    return this.jwt.decode(token, null) as { [key: string]: any };
  }

  async generateToken(
    body: { [key: string]: string | number },
    expiresIn: string | number = '20h',
  ): Promise<string> {
    return this.jwt.signAsync(body, { expiresIn });
  }

  async validateTokenPassport(payload: PassportPayload): Promise<any> {
    try {
      if (payload.type === TokenType.ACCESS_TOKEN) {
        const tokenExpired = payload.exp < moment().unix();

        let user: User;

        if (!tokenExpired) {
          await this.authService.validateToken(user.refreshToken);

          const newAccessToken = await this.generateToken({
            id: user.id,
            type: TokenType.ACCESS_TOKEN,
          });

          user.accessToken = newAccessToken;

          await user.save();

          return user;
        }

        user = await User.findOne({
          where: {
            id: Number(payload.id),
          },
        });

        if (!user) UserNotFoundError();

        return user;
      } else {
        DecryptFailedError('Invalid Token');
      }
    } catch (error) {
      return false;
    }
  }

  async validateUser(payload: any): Promise<User> {
    return this.authService.validateUser({
      ...payload,
    });
  }

  async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwt.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: User = await this.validateUser(decoded);

    if (!user) UserNotFoundError();

    return true;
  }
}
