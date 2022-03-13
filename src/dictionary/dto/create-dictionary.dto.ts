import { ApiProperty } from '@nestjs/swagger';

export class CreateDictionaryDto {
  @ApiProperty({ example: 'Фауна Африки', description: 'Название словаря' })
  readonly name: string;

  @ApiProperty({
    example: 'Список животных африки для начального изучения',
    description: 'Описание словаря',
  })
  readonly description: string;

  @ApiProperty({ example: 'english', description: 'Язык с которого переводят' })
  readonly from: string;

  @ApiProperty({ example: 'russian', description: 'Язык на который переводят' })
  readonly to: string;

  @ApiProperty({
    example: 'true',
    description: 'Доступен ли словарь другим пользователям',
  })
  readonly private: boolean;
}
