import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';

export class GetCardDto extends PickType(CreateCardDto, [
  'associations',
  'phrase',
] as const) {
  @ApiProperty({
    example: '1',
    description: 'Id карточки',
  })
  readonly id: number;

  @ApiProperty({ example: '0', description: 'Счетчик изучения фразы' })
  readonly counter: string;
}
