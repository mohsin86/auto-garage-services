import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceStatus } from '../entities/service.entity';
import { CreateServiceItemDto } from './service-item.dto';

export class CreateServiceDto {
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsOptional()
  @IsString()
  problemDescription?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  serviceDate?: Date;

  @IsOptional()
  @IsDateString()
  deliveryDate?: Date;

  // relations (IMPORTANT: use IDs, not full objects)
  @IsUUID()
  vehicleId!: string;

  @IsUUID()
  customerId!: string;

  @IsOptional()
  @IsUUID()
  createdById?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceItemDto)
  items?: CreateServiceItemDto[];

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  mechanicIds?: string[];
}