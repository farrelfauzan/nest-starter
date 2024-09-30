import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { UserRegisterDto } from './dto/user-register.dto';
import { Request, Response as Res } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { User } from 'src/user/entities/user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost<ExpressAdapter>,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() userRegister: UserRegisterDto,
    @Response({ passthrough: true }) res: Res,
  ): Promise<{ data: User }> {
    const register = await this.authService.register(userRegister);
    return { data: register };
  }

  @Public()
  @Post('login')
  async login(
    @Body() userLoginDto: UserLoginDto,
    @Response({ passthrough: true }) res: Res,
  ) {
    const body = { ...userLoginDto };

    const login = await this.authService.login(body);

    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.setHeader(res, 'authorization', `Bearer ${login.accessToken}`);

    return { data: login };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    await this.authService.logout({
      id: String(req.user?.id),
    });

    return {
      data: [],
    };
  }
}
