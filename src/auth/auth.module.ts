import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthHelper } from 'src/helpers/auth.helper';
import { CustomPassportStrategy } from './passport.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, CustomPassportStrategy, AuthHelper],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET_SIGNER'),
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class AuthModule {}
