import {
  IsString,
  IsOptional,
  IsNumberString,
  Length,
  IsUUID,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  registrationNumber!: string;

  @IsOptional()
  @IsString()
  vinNumber?: string;

  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsString()
  year!: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  engineNumber?: string;

  @IsOptional()
  @IsString()
  chassisNumber?: string;

  @IsOptional()
  @IsString()
  mileage?: string;

  @IsOptional()
  @IsUUID()
  ownerId?: string;
}