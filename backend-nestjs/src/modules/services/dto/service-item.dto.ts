import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateServiceItemDto {
  @IsString()
  title!: string;

  @IsNumber()
  cost!: number;

  @IsOptional()
  @IsString()
  status?: string; // later you can convert to enum
}