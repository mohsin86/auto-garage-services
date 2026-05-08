import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

import { ServiceEntity } from './entities/service.entity';
import { ServiceItemEntity } from './entities/service-item.entity';
import { VehicleEntity } from '../vehicles/entities/vehicle.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InvoiceEntity } from '../invoices/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceEntity,
      ServiceItemEntity,
      VehicleEntity,   // ✅ THIS FIXES YOUR ERROR
      UserEntity,
      InvoiceEntity
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}