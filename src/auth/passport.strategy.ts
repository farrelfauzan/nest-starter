import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthHelper } from 'src/helpers/auth.helper';
import { PassportPayload } from 'src/interfaces/passport.interface';

@Injectable()
export class CustomPassportStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET_SIGNER'),
    });
  }

  public async validate(payload: PassportPayload): Promise<any> {
    return await this.helper.validateTokenPassport(payload);
  }
}
