// File: src/modules/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {
    console.log('UsersService initialized');
  }

  async create(dto: CreateUserDto) {
     const hashed = await bcrypt.hash(dto.password, 10);
     const user = this.repo.create({   
                          name: dto.name,
                          username: dto.username,
                          email: dto.email,
                          mobile: dto.mobile,
                          address: dto.address,
                          password: hashed 
                        }); 
     return this.repo.save(user);
  }

  findAll() {
    return this.repo.find({
      relations: ['vehicles'], // important for relation
    });
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['vehicles'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async fineOneByIdentifier(identifier: string){
    let user: any;
    if (identifier.includes('@')) {
       user =  await this.repo.findOne({
        where: { email: identifier },
        select: ['id','name','username','email', 'mobile', 'password','role']
      });
    }

     user = await this.repo.findOne({
      where: [
        { username: identifier },
        { mobile: identifier },
      ],
      select: ['id','name','username','email', 'mobile', 'password','role']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    return user;
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findByMobile(mobile: string) {
    return this.repo.findOne({ where: { mobile } });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
  await this.repo.update(userId, {
      refreshToken: refreshToken ?? undefined,
    });
  }
}