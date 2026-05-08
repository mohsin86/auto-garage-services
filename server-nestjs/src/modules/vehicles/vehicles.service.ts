import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VehicleEntity } from './entities/vehicle.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepo: Repository<VehicleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  // CREATE VEHICLE
  async create(currentUserId: string, dto: CreateVehicleDto, isAdmin = false) {
    const ownerId = dto.ownerId ?? currentUserId;

    if (!isAdmin && dto.ownerId && dto.ownerId !== currentUserId) {
      throw new ForbiddenException('Not allowed to assign owner');
    }

    const owner = await this.userRepo.findOneBy({ id: ownerId });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const vehicle = this.vehicleRepo.create({
      ...dto,
      owner,
    });

    return this.vehicleRepo.save(vehicle);
  }

  // GET ALL VEHICLES (user scoped)
  async findAll(userId: string, isAdmin = false) {
    return this.vehicleRepo.find({
      where: isAdmin ? {} : { owner: { id: userId } },
      relations: ['owner', 'services'],
      order: { createdAt: 'DESC' },
    });
  }

  // GET ONE VEHICLE
  async findOne(id: string, userId: string, isAdmin = false) {
    const vehicle = await this.vehicleRepo.findOne({
      where: {
        id,
        ...(isAdmin ? {} : { owner: { id: userId } }),
      },
      relations: ['owner', 'services'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  // UPDATE VEHICLE
  async update(
    id: string,
    userId: string,
    dto: UpdateVehicleDto,
    isAdmin = false,
  ) {
    const vehicle = await this.findOne(id, userId, isAdmin);

    // prevent unauthorized owner change
    if (!isAdmin && dto.ownerId && dto.ownerId !== userId) {
      throw new ForbiddenException('Cannot change owner');
    }

    if (dto.ownerId && isAdmin) {
      const owner = await this.userRepo.findOneBy({ id: dto.ownerId });
      if (!owner) throw new NotFoundException('Owner not found');
      vehicle.owner = owner;
    }

    Object.assign(vehicle, dto);

    return this.vehicleRepo.save(vehicle);
  }

  // DELETE VEHICLE
  async remove(id: string, userId: string, isAdmin = false) {
    const vehicle = await this.findOne(id, userId, isAdmin);

    return this.vehicleRepo.remove(vehicle);
  }
}