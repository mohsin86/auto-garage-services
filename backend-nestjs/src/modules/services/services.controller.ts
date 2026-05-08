// File: src/modules/services/services.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
} from '@nestjs/common';

import { ServicesService } from './services.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/updateService.dto';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  // ================= CREATE =================
  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  // ================= GET ALL =================
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('mechanicId') mechanicId?: string,
  ) {
    return this.servicesService.findAll({
      status,
      customerId,
      mechanicId,
    });
  }

  // ================= GET ONE =================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  // ================= UPDATE =================
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }

  // ================= DELETE =================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  // ================= UPDATE STATUS =================
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.servicesService.updateStatus(id, status);
  }

  // ================= ASSIGN MECHANICS =================
  @Patch(':id/mechanics')
  assignMechanics(
    @Param('id') id: string,
    @Body('mechanicIds') mechanicIds: string[],
  ) {
    return this.servicesService.assignMechanics(
      id,
      mechanicIds,
    );
  }
}