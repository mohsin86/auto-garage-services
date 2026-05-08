import { IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsUUID()
  serviceId!: string;

  @IsUUID()
  generatedById!: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}