import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { CreatePhraseDto } from 'src/phrase/dto/create-phrase.dto';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CreateCardDto) {}

export class UpdateDescriptionCardDto extends PickType(CreateCardDto, [
  'description',
] as const) {}

export class UpdatePhraseCardDto extends PickType(CreateCardDto, [
  'phrase',
] as const) {}

export class UpdateAssociationsCardDto extends IntersectionType(
  CreatePhraseDto,
  CreateImageDto,
) {
  @ApiProperty({
    example: 'Cat - катарсис - кот',
    description: 'Описание ассоциации',
  })
  readonly description: string;
}

export class UpdateDescriptionAssociationDto extends PickType(
  UpdateAssociationsCardDto,
  ['description'] as const,
) {}
