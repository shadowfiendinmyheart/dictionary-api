import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { CreatePhraseDto } from 'src/phrase/dto/create-phrase.dto';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {}
export class UpdateNameCardDto extends PickType(CreateCardDto, [
  'phrase',
] as const) {}

export class UpdateAssociationsCardDto extends IntersectionType(
  CreatePhraseDto,
  CreateImageDto,
) {}
