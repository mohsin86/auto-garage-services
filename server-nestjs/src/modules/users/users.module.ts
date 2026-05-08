// File: src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // add any modules that UsersModule depends on here e.g., DatabaseModule, AuthModule if you have authentication logic
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]  // Export so other modules can inject UsersService
})
export class UsersModule {}
