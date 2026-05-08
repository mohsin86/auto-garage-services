

import { IsString, IsInt, MinLength,Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  email!: string;

  @IsString()
  // @Matches(/^\+?[0-9]{10,15}$/, {
  //   message: 'Invalid mobile number',
  // })
  mobile!: string;

  @IsString()
  address!: string;

  @IsString()
  @MinLength(6)
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
  // message:
  //   'Password must contain uppercase, lowercase, number, and special character',
  // })
  password!: string;

}