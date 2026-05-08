// File: src/modules/services/services.service.ts

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  In,
  Repository,
} from 'typeorm';

import {
  ServiceEntity,
  ServiceStatus,
} from './entities/service.entity';

import { ServiceItemEntity } from './entities/service-item.entity';

import { VehicleEntity } from '../vehicles/entities/vehicle.entity';

import { UserEntity } from '../users/entities/user.entity';

import { CreateServiceDto } from './dto/create-service.dto';

import { UpdateServiceDto } from './dto/updateService.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,

    @InjectRepository(ServiceItemEntity)
    private readonly itemRepo: Repository<ServiceItemEntity>,

    @InjectRepository(VehicleEntity)
    private readonly vehicleRepo: Repository<VehicleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  // ======================================================
  // CREATE SERVICE
  // ======================================================

  async create(dto: CreateServiceDto) {
    // ---------------- VEHICLE ----------------
    const vehicle = await this.vehicleRepo.findOne({
      where: {
        id: dto.vehicleId,
      },
    });

    if (!vehicle) {
      throw new NotFoundException(
        'Vehicle not found',
      );
    }

    // ---------------- CUSTOMER ----------------
    const customer = await this.userRepo.findOne({
      where: {
        id: dto.customerId,
      },
    });

    if (!customer) {
      throw new NotFoundException(
        'Customer not found',
      );
    }

    // ---------------- CREATED BY ----------------
    const createdBy = await this.userRepo.findOne({
      where: {
        id: dto.createdById,
      },
    });

    if (!createdBy) {
      throw new NotFoundException(
        'CreatedBy user not found',
      );
    }

    // ---------------- MECHANICS ----------------
    let mechanics: UserEntity[] = [];

    if (
      dto.mechanicIds &&
      dto.mechanicIds.length > 0
    ) {
      mechanics = await this.userRepo.find({
        where: {
          id: In(dto.mechanicIds),
        },
      });
    }

    // ---------------- ITEMS ----------------
    const items = (dto.items||[]).map((item) =>
      this.itemRepo.create({
        title: item.title,
        cost: item.cost,
        status: item.status || 'pending',
      }),
    );

    // ---------------- CREATE SERVICE ----------------
    const service = this.serviceRepo.create({
      status:
        dto.status || ServiceStatus.PENDING,

      problemDescription:
      dto.problemDescription,

      notes: dto.notes,

      serviceDate: dto.serviceDate,

      deliveryDate: dto.deliveryDate,

      vehicle,

      customer,

      createdBy,

      mechanics,

      items,
    });

    return this.serviceRepo.save(service);
  }

  // ======================================================
  // FIND ALL
  // ======================================================

  async findAll(filters?: {
    status?: string;
    customerId?: string;
    mechanicId?: string;
  }) {
    const qb =
      this.serviceRepo.createQueryBuilder(
        'service',
      );

    qb.leftJoinAndSelect(
      'service.vehicle',
      'vehicle',
    );

    qb.leftJoinAndSelect(
      'service.customer',
      'customer',
    );

    qb.leftJoinAndSelect(
      'service.createdBy',
      'createdBy',
    );

    qb.leftJoinAndSelect(
      'service.mechanics',
      'mechanics',
    );

    qb.leftJoinAndSelect(
      'service.items',
      'items',
    );

    // ---------------- FILTERS ----------------

    if (filters?.status) {
      qb.andWhere(
        'service.status = :status',
        {
          status: filters.status,
        },
      );
    }

    if (filters?.customerId) {
      qb.andWhere(
        'customer.id = :customerId',
        {
          customerId: filters.customerId,
        },
      );
    }

    if (filters?.mechanicId) {
      qb.andWhere(
        'mechanics.id = :mechanicId',
        {
          mechanicId: filters.mechanicId,
        },
      );
    }

    qb.orderBy(
      'service.createdAt',
      'DESC',
    );

    return qb.getMany();
  }

  // ======================================================
  // FIND ONE
  // ======================================================

  async findOne(id: string) {
    const service =
      await this.serviceRepo.findOne({
        where: {
          id,
        },

        relations: [
          'vehicle',
          'customer',
          'createdBy',
          'mechanics',
          'items',
          'invoices',
        ],
      });

    if (!service) {
      throw new NotFoundException(
        'Service not found',
      );
    }

    return service;
  }

  // ======================================================
  // UPDATE
  // ======================================================

  async update(
    id: string,
    dto: UpdateServiceDto,
  ) {
    const service = await this.findOne(id);

    // ---------------- BASIC UPDATE ----------------
    if (dto.status) {
      service.status = dto.status;
    }

    if (dto.problemDescription !== undefined) {
      service.problemDescription =
        dto.problemDescription;
    }

    if (dto.notes !== undefined) {
      service.notes = dto.notes;
    }

    if (dto.serviceDate) {
      service.serviceDate =
        dto.serviceDate;
    }

    if (dto.deliveryDate) {
      service.deliveryDate =
        dto.deliveryDate;
    }

    // ---------------- VEHICLE ----------------
    if (dto.vehicleId) {
      const vehicle =
        await this.vehicleRepo.findOne({
          where: {
            id: dto.vehicleId,
          },
        });

      if (!vehicle) {
        throw new NotFoundException(
          'Vehicle not found',
        );
      }

      service.vehicle = vehicle;
    }

    // ---------------- CUSTOMER ----------------
    if (dto.customerId) {
      const customer =
        await this.userRepo.findOne({
          where: {
            id: dto.customerId,
          },
        });

      if (!customer) {
        throw new NotFoundException(
          'Customer not found',
        );
      }

      service.customer = customer;
    }

    // ---------------- MECHANICS ----------------
    if (dto.mechanicIds) {
      const mechanics =
        await this.userRepo.find({
          where: {
            id: In(dto.mechanicIds),
          },
        });

      service.mechanics = mechanics;
    }

    // ---------------- ITEMS ----------------
    if (dto.items) {
      service.items = dto.items.map(
        (item) =>
          this.itemRepo.create({
            title: item.title,
            cost: item.cost,
            status: item.status,
          }),
      );
    }

    return this.serviceRepo.save(service);
  }

  // ======================================================
  // DELETE
  // ======================================================

  async remove(id: string) {
    const service = await this.findOne(id);

    return this.serviceRepo.remove(service);
  }

  // ======================================================
  // UPDATE STATUS
  // ======================================================

  async updateStatus(
    id: string,
    status: string,
  ) {
    const service = await this.findOne(id);

    service.status =
      status as ServiceStatus;

    return this.serviceRepo.save(service);
  }

  // ======================================================
  // ASSIGN MECHANICS
  // ======================================================

  async assignMechanics(
    serviceId: string,
    mechanicIds: string[],
  ) {
    const service =
      await this.findOne(serviceId);

    const mechanics =
      await this.userRepo.find({
        where: {
          id: In(mechanicIds),
        },
      });

    service.mechanics = mechanics;

    return this.serviceRepo.save(service);
  }
}