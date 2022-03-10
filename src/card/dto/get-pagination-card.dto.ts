import { ApiProperty } from '@nestjs/swagger';
import { GetCardDto } from './get-card.dto';

export class GetPaginationCardDto {
  @ApiProperty({
    example: '100',
    description: 'Количество карточек в словаре',
  })
  readonly count: number;

  // TODO: find way to fix example
  @ApiProperty({
    example: `{
    "phrase": "cat",
    "associations": "[{translate: кот, image: http://funny-cat.jpeg}]",
    "id": 1,
    "counter": "0"
  }`,
    description: 'Карточки',
  })
  readonly cards: GetCardDto[];
}
