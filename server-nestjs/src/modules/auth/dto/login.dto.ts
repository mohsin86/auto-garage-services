// File: src/modules/auth/login.dto.ts

import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  // @IsEmail()
  // email!: string; // only for if login my  only email

  
  @IsString()
  identifier!: string; // email OR username OR mobile

  @IsString()
  @MinLength(6)
  password!: string;
  
}