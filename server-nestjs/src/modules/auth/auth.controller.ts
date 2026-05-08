// File: src/modules/auth/auth.controller.ts

import { Body, Controller, Post, Req, Res, UseGuards  } from '@nestjs/common';
import type { Response, Request } from 'express';

import { AuthService } from './auth.service';

import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import {LoginDto} from '../auth/dto/login.dto';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login') 
  async login( @Body() dto: LoginDto, @Res({ passthrough: true }) res: Response,) {
    // return this.auth.login(body.email, body.password);
    //return this.auth.login(dto);
      
    const user = await this.auth.login(dto);
    
    res.cookie('refresh_token', user.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // important
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return user;
    
  }

 @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.auth.register({
                          name: dto.name,
                          username: dto.username,
                          email: dto.email,
                          mobile: dto.mobile,
                          address: dto.address,
                          password: dto.password 
    });
  }


  @Post('refresh')
  //refresh(@Body() body: any) {
  async  refresh( @Req() req: Request, @Res({ passthrough: true }) res: Response,
  ) {
    //return this.auth.refreshTokens(body.userId, body.refreshToken);
     const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    // 🔥 Decode token to get userId
    const payload = this.auth.decodeToken(refreshToken);


    if (!payload || !payload.sub) {
      throw new Error('Invalid token');
    }

    const tokens = await this.auth.refreshTokens(
      payload.sub,
      refreshToken,
    );

    // 🔄 rotate refresh token
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: tokens.access_token,
    };
  }

   @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @User() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logout(user.sub);

    // 🧹 clear cookie
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }
}