import { ApiProperty } from '@nestjs/swagger';

export class CreateDictionaryDto {
  @ApiProperty({ example: 'animals', description: 'Название словаря' })
  readonly name: string;

  @ApiProperty({ example: 'english', description: 'Язык словаря' })
  readonly language: string;

  @ApiProperty({
    example: 'true',
    description: 'Доступен ли словарь другим пользователям',
  })
  readonly private: boolean;
}
