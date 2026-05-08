//  File: src/module/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import {LoginDto} from '../auth/dto/login.dto';
import {CreateUserDto} from '../users/dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    console.log('Register received', dto);
    const user = await this.usersService.create(dto);
    return user;
  }

  //async login(email: string, password: string) {
  async login(dto: LoginDto) {

      //const user = await this.usersService.findByEmail(dto.email);
      const user = await this.usersService.fineOneByIdentifier(dto.identifier);

      if (!user) throw new Error('User not found');

      const isMatch = await bcrypt.compare(dto.password, user.password);
      
      if (!isMatch) throw new Error('Invalid credentials');

      const tokens = await this.generateTokens(user);

      await this.updateRefreshToken(user.id, tokens.refresh_token);

      //return tokens;
      return {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            mobile: user.mobile,
            role: user.role,
          },
        };

  }
  
  

  async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    // await this.usersService.update(userId, {
    //   refreshToken: hashed,
    // });
    await this.usersService.updateRefreshToken(userId, hashed);
  }

  async refreshTokens(userId: string, refreshToken: string) {
      const user = await this.usersService.findOne(userId);

      if (!user || !user.refreshToken)
        throw new Error('Access Denied');

      const isMatch = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isMatch) throw new Error('Invalid refresh token');

      const tokens = await this.generateTokens(user);

      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
    
  }
  
  async logout(userId: string) {
    return this.usersService.updateRefreshToken(userId, null);
  }
  

}

