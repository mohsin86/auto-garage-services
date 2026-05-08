import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvoiceEntity } from './entities/invoice.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepo: Repository<InvoiceEntity>,

    @InjectRepository(ServiceEntity)
    private serviceRepo: Repository<ServiceEntity>,

    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateInvoiceDto) {
    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
      relations: ['items'],
    });

    if (!service) throw new NotFoundException('Service not found');

    const user = await this.userRepo.findOne({
      where: { id: dto.generatedById },
    });

    if (!user) throw new NotFoundException('User not found');

    // 🔥 AUTO CALCULATE TOTAL FROM SERVICE ITEMS
    const total =
      service.items?.reduce(
        (sum, item) => sum + Number(item.cost),
        0,
      ) || 0;

    const invoice = this.invoiceRepo.create({
      service,
      generatedBy: user,
      totalAmount: total,
      paymentStatus: 'unpaid',
    });

    return this.invoiceRepo.save(invoice);
  }

  async findAll() {
    return this.invoiceRepo.find();
  }

  async findOne(id: string) {
    return this.invoiceRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    const invoice = await this.findOne(id);
    if (!invoice) throw new NotFoundException();

    invoice.paymentStatus = status as any;
    return this.invoiceRepo.save(invoice);
  }
}