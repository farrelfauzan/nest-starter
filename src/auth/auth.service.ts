import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthHelper } from 'src/helpers/auth.helper';
import {
  DecryptFailedError,
  UserNotFoundError,
  WrongPasswordError,
} from 'src/errors/ResourceError';
import { TokenType } from 'src/types/enums';
import { User } from 'src/user/entities/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthLogin, AuthLoginDto } from './dto/login.dto';
import { FindOptionsWhere } from 'typeorm';
import { validateHash } from 'src/helpers/password.helpers';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(registerDto: UserRegisterDto): Promise<User> {
    const user = await User.findOne({
      where: [{ email: registerDto.email }, { username: registerDto.username }],
    });

    if (user) DecryptFailedError('User already exist');

    const newUser = new User();
    newUser.username = registerDto.username;
    newUser.email = registerDto.email;
    newUser.password = registerDto.password;
    newUser.firstName = registerDto.firstName;
    newUser.lastName = registerDto.lastName;

    return await newUser.save();
  }

  public async login(loginDto: UserLoginDto): Promise<AuthLogin> {
    const { username, password } = loginDto;

    const user = await this.validateLogin({
      username,
    });

    if (!user) UserNotFoundError();

    const isPasswordValid = await validateHash(password, user.password);

    if (!isPasswordValid) WrongPasswordError();

    const token = await this.generateTokens(user);

    const { accessToken, refreshToken } = await this.updateUserTokens(
      user,
      token,
    );

    const loginPayload = this.createLoginPayload(
      user,
      accessToken,
      refreshToken,
      token.expiresIn,
    );

    return new AuthLoginDto(loginPayload);
  }

  private createLoginPayload(
    user: User,
    accessToken: string,
    refreshToken: string,
    expiresIn: string,
  ): AuthLogin {
    const loginPayload = new AuthLogin();

    loginPayload.fullName = user.fullName;
    loginPayload.accessToken = accessToken;
    loginPayload.refreshToken = refreshToken;
    loginPayload.lastAccessedAt = new Date();
    loginPayload.expiredIn = Number(expiresIn);

    return loginPayload;
  }

  private async updateUserTokens(
    user: User,
    token: { accessToken: string; refreshToken: string },
  ) {
    let userAccessToken = user.accessToken;
    let userRefreshToken = user.refreshToken;

    if (user.accessToken) {
      const jwt = await this.helper.decode(user.accessToken);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (jwt.exp < currentTimestamp) {
        userAccessToken = token.accessToken;
        userRefreshToken = token.refreshToken;
      }
    }

    user.accessToken = userAccessToken;
    user.refreshToken = userRefreshToken;

    user.lastAccessedAt = new Date();

    await user.save();

    return { accessToken: userAccessToken, refreshToken: userRefreshToken };
  }

  private async generateTokens(user: User) {
    const accessToken = await this.helper.generateToken({
      id: user.id.toString(),
      type: TokenType.ACCESS_TOKEN,
    });

    const refreshToken = await this.helper.generateToken(
      {
        id: user.id.toString(),
        type: TokenType.REFRESH_TOKEN,
      },
      '30d',
    );

    return { accessToken, refreshToken, expiresIn: '30d' };
  }

  public async validateLogin(validateWith: {
    username?: string;
    email?: string;
  }): Promise<User> {
    let user: User;

    let where: FindOptionsWhere<User> = undefined;

    if (validateWith.username) where = { username: validateWith.username };

    if (validateWith.email) where = { email: validateWith.email };

    if (!where) DecryptFailedError('Invalid Login Credentials');

    user = await User.findOne({
      where,
    });

    return user;
  }

  async validateToken(token: string) {
    const jwt = await this.helper.decode(token);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expired = jwt.exp < currentTimestamp;

    if (expired)
      DecryptFailedError(
        'Token already expired! Please request new token at Forgot Password Page!',
      );

    if (jwt?.type !== TokenType.FORGOT_PASSWORD_TOKEN)
      DecryptFailedError('Invalid Token');

    return true;
  }

  async validateUser(validateWith: { id: string }) {
    let user: User;

    if (!validateWith.id) return undefined;

    const id = Number(validateWith.id);

    user = await User.findOne({
      where: {
        id,
      },
    });

    return user;
  }
}
