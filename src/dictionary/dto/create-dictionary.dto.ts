import { ApiProperty } from '@nestjs/swagger';

export class CreateDictionaryDto {
  @ApiProperty({ example: 'animals', description: 'Название словаря' })
  readonly name: string;

  @ApiProperty({ example: 'english', description: 'Язык словаря' })
  readonly language: string;

  @ApiProperty({
    example: '1',
    description:
      'Уникальный идентификатор пользователя, которому принадлежит словарь',
  })
  readonly user_id: number;
}
