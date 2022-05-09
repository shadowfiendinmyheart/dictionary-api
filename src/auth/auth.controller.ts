import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { GetAuthDto, MakeAuthDto } from './dto/get-auth.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({ status: 200, type: GetAuthDto })
  @Post('/login')
  login(@Body() userDto: MakeAuthDto) {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 201, type: GetAuthDto })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @ApiOperation({ summary: 'Обновить токен' })
  @ApiResponse({ status: 200, type: GetAuthDto })
  @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  refresh() {
    return this.authService.refresh();
  }
}
