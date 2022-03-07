import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserUsernameDto } from './dto/update-user-username.dto';

@ApiTags('Пользователь')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получить пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Get(':id')
  get(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @ApiOperation({ summary: 'Поменять пароль пользователя' })
  @ApiResponse({ status: 204 })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Patch('/changePassword')
  changePassword(@Body() userDto: UpdateUserPasswordDto) {
    return this.userService.changePassword(userDto.password);
  }

  @ApiOperation({ summary: 'Поменять пароль пользователя' })
  @ApiResponse({ status: 204 })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Patch('/changeUsername')
  changeUsername(@Body() userDto: UpdateUserUsernameDto) {
    return this.userService.changeUsername(userDto.username);
  }
}
