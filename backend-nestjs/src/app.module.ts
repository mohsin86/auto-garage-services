// File: src/app.module.ts
// Use Render (for deployment)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServicesModule } from './modules/services/services.module';
import { InvoicesModule } from './modules/invoices/invoices.module';


// DB CONNECTED THROUGH app.module.ts VIA importing TypeOrmModule and configuring it with the database connection details.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),

    UsersModule,
    VehiclesModule,
    AuthModule,
    ServicesModule,
    InvoicesModule, // ✅ correct
  ],
  controllers: [AppController],
  providers: [AppService], // ✅ ONLY THIS
})

export class AppModule {}
