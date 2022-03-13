import { PartialType, PickType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {}
export class UpdateNameCardDto extends PickType(CreateCardDto, [
  'phrase',
] as const) {}
