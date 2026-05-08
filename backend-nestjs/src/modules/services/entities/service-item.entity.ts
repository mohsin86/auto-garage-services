import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { ServiceEntity } from './service.entity';

@Entity('service_items')
export class ServiceItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  cost!: number;

  @Column({
    default: 'pending',
  })
  status!: string;

  // ---------------- SERVICE ----------------
  @ManyToOne(() => ServiceEntity, (service) => service.items, {
    onDelete: 'CASCADE',
  })
  service!: ServiceEntity;
}