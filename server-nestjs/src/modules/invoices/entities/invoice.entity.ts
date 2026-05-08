import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { ServiceEntity } from '../../services/entities/service.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('invoices')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ default: 'unpaid' })
  paymentStatus!: 'unpaid' | 'paid' | 'partial';

  @ManyToOne(() => ServiceEntity, (service) => service.invoices, {
    eager: true,
    onDelete: 'CASCADE',
  })
  service!: ServiceEntity;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  generatedBy!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;
}