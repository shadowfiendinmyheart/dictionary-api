import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/models/user.model';
import { MakeAuthDto } from './dto/get-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: MakeAuthDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const checkByEmail = await this.userService.getUserByEmail(userDto.email);
    if (checkByEmail) {
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkByUsername = await this.userService.getUserByUsername(
      userDto.username,
    );
    if (checkByUsername) {
      throw new HttpException(
        'Пользователь с таким username уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(userDto.password, salt);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }

  async refresh() {
    const userReq = this.request.user;
    const user = await this.userService.getUserByEmail(userReq.email);
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { id: user.id, email: user.email, username: user.username };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: Partial<CreateUserDto>) {
    const user = userDto.email
      ? await this.userService.getUserByEmail(userDto.email)
      : await this.userService.getUserByUsername(userDto.username);

    if (!user) {
      throw new UnauthorizedException({ message: 'Неверные данные для входа' });
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Неверные данные для входа' });
  }
}
