import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { ServiceEntity } from '../../services/entities/service.entity';

@Entity('vehicles')
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  registrationNumber!: string;

  @Column({ nullable: true })
  vinNumber!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: string;

  @Column({ nullable: true })
  color!: string;

  @Column({ nullable: true })
  engineNumber!: string;

  @Column({ nullable: true })
  chassisNumber!: string;

  @Column({ nullable: true })
  mileage!: string;

  // ---------------- OWNER ----------------
  @ManyToOne(() => UserEntity, (user) => user.vehicles)
  owner!: UserEntity;

  // ---------------- SERVICES ----------------
  @OneToMany(() => ServiceEntity, (service) => service.vehicle)
  services!: ServiceEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}