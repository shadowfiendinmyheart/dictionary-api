import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'coolguy', description: 'Имя пользователя' })
  readonly username: string;

  @ApiProperty({ example: 'user@mail.com', description: 'Почта пользователя' })
  readonly email: string;

  @ApiProperty({ example: 'qwerty123', description: 'Пароль пользователя' })
  readonly password: string;
}
