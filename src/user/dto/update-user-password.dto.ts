import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty({
    example: 'qwerty12345',
    description: 'Новый пароль пользователя',
  })
  readonly password: string;
}
