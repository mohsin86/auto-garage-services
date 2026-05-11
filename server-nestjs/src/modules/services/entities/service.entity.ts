import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { VehicleEntity } from '../../vehicles/entities/vehicle.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { ServiceItemEntity } from './service-item.entity';
import { InvoiceEntity } from '../../invoices/entities/invoice.entity';

export enum ServiceStatus {
   PENDING = "pending",
   CONFIRMED = "confirmed",
   IN_PROGRESS = "in_progress",
   COMPLETED = "completed",
   CANCELLED = "cancelled",
}

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: "enum",
    enum: ServiceStatus,
    default: ServiceStatus.PENDING,
  })
  status!: ServiceStatus;

  @Column({
    nullable: true,
    type: 'text',
  })
  problemDescription!: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  notes!: string;

  @Column({
    nullable: true,
    type: "date",
  })
  serviceDate!: Date;

  @Column({
    nullable: true,
    type: "date",
  })
  deliveryDate!: Date;

  // ---------------- VEHICLE ----------------
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.services, {
    eager: true,
    onDelete: 'CASCADE',
  })
  vehicle!: VehicleEntity;

  // ---------------- CUSTOMER ----------------
  @ManyToOne(() => UserEntity, (user) => user.customerServices, {
    eager: true,
  })
  customer!: UserEntity;

  // ---------------- CREATED BY ----------------
  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  createdBy!: UserEntity;

  // ---------------- MECHANICS ----------------
  @ManyToMany(() => UserEntity, (user) => user.assignedServices, {
    eager: true,
  })
  @JoinTable({
    name: 'service_mechanics',
  })
  mechanics!: UserEntity[];

  // ---------------- SERVICE ITEMS ----------------
  @OneToMany(() => ServiceItemEntity, (item) => item.service, {
    cascade: true,
    eager: true,
  })
  items!: ServiceItemEntity[];

  // ---------------- INVOICE ----------------
  @OneToMany(() => InvoiceEntity, (invoice) => invoice.service)
  invoices!: InvoiceEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}