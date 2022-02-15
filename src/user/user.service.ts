import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async changeUserPassword(password: string) {
    const user = this.request.user;
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const updatedUser = await this.userRepository.update(
      { password: hashPassword },
      {
        where: { id: user.id },
      },
    );
    return updatedUser;
  }

}
