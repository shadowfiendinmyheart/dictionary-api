import { PickType } from '@nestjs/swagger';
import { CreateDictionaryDto } from './create-dictionary.dto';

export class UpdateNameDictionaryDto extends PickType(CreateDictionaryDto, [
  'name',
] as const) {}
