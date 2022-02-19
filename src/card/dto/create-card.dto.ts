import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ example: 'cat', description: 'Иностранная фраза' })
  readonly phrase: string;

  @ApiProperty({
    example: '[{translate: кот, image: http://funny-cat.jpeg}]',
    description: 'Массив объектов ассоциаций',
  })
  readonly associations: { translate: string; image: string }[];
}
