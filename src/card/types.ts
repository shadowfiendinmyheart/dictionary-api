import { ApiProperty } from '@nestjs/swagger';

export enum CardCounterMode {
  GreaterThan,
  LessThan,
  Equals,
  GreaterOrEqual,
  LessOrEqual,
}

export class PaginationQuery {
  @ApiProperty({
    example: '0',
    description: 'Номер страницы',
  })
  page: number;

  @ApiProperty({
    example: '0',
    description: 'Сколько слов получить',
  })
  size: number;
}

export class RandomQuery {
  @ApiProperty({
    example: '1',
    description: 'Значение Counter карточки',
  })
  counter: number;

  @ApiProperty({
    example: '0',
    description:
      '0 - Больше counter; 1 - Меньше counter; 2 - Равно counter; 3 - Больше или равно counter; 4 - Меньше или равно counter',
  })
  mode: number;

  @ApiProperty({
    example: '0',
    description: 'Сколько слов получить',
  })
  size: number;
}
