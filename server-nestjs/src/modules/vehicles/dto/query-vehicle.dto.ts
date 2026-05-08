import { IsOptional, IsString } from 'class-validator';

export class QueryVehicleDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  brand?: string;
}