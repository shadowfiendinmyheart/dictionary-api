import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'superCoolguy',
    description: 'Новое имя пользователя',
  })
  readonly username: string;

  @ApiProperty({
    example: 'qwerty12345',
    description: 'Новый пароль пользователя',
  })
  readonly password: string;
}
