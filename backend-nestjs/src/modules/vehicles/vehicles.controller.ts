import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // CREATE
  @Post()
  create(@Req() req: any, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(
      req.user.sub,
      dto,
      req.user.role === 'admin',
    );
  }

  // GET ALL
  @Get()
  findAll(@Req() req: any) {
    return this.vehiclesService.findAll(
      req.user.sub,
      req.user.role === 'admin',
    );
  }

  // GET ONE
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.vehiclesService.findOne(
      id,
      req.user.sub,
      req.user.role === 'admin',
    );
  }

  // UPDATE
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(
      id,
      req.user.sub,
      dto,
      req.user.role === 'admin',
    );
  }

  // DELETE
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.vehiclesService.remove(
      id,
      req.user.sub,
      req.user.role === 'admin',
    );
  }
}