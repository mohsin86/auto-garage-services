import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { VehicleEntity } from './entities/vehicle.entity';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private repo: Repository<VehicleEntity>,

    @InjectRepository(UserEntity)
    private usersRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateVehicleDto) {
    const owner = await this.usersRepo.findOne({
      where: { id: dto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const vehicle = this.repo.create({
      registrationNumber: dto.registrationNumber,
      vinNumber: dto.vinNumber,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      color: dto.color,
      engineNumber: dto.engineNumber,
      chassisNumber: dto.chassisNumber,
      mileage: dto.mileage,
      owner,
    });

    return this.repo.save(vehicle);
  }

  async findAll() {
    return this.repo.find({
      relations: ['owner'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByOwner(ownerId: string) {
    return this.repo.find({
      where: {
        owner: {
          id: ownerId,
        },
      },

      relations: ['owner'],

      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.repo.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!vehicle) {
      throw new NotFoundException(
        'Vehicle not found',
      );
    }

    return vehicle;
  }

  async update(
    id: string,
    dto: UpdateVehicleDto,
  ) {
    const vehicle = await this.findOne(id);

    Object.assign(vehicle, dto);

    return this.repo.save(vehicle);
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);

    return this.repo.remove(vehicle);
  }

  
}