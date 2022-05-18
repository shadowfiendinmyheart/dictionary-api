import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({
    example: '1',
    description: 'Id словаря',
  })
  readonly dictionaryId: number;

  @ApiProperty({ example: 'Cat', description: 'Иностранная фраза' })
  readonly phrase: string;

  @ApiProperty({
    example: 'Домашний питомец',
    description: 'Описание карточки',
  })
  readonly description: string;

  @ApiProperty({
    example:
      '[{translate: [кот, кошка, котяра], description: cat - катарсис - кот, image: http://funny-cat.jpeg}]',
    description: 'Массив объектов ассоциаций',
  })
  readonly associations: {
    translate: string[];
    image: string;
    description: string;
  }[];
}
