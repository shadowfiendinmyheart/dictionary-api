import { ApiProperty } from '@nestjs/swagger';
import { Languages } from 'src/translate/types';

export class CreateLanguageDto {
  @ApiProperty({
    example: 'russian',
    description: 'Название языка',
  })
  readonly name: Languages;
}
