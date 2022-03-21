import { ApiProperty } from '@nestjs/swagger';
import { Languages } from '../types';

export class CreateTranslateDto {
  @ApiProperty({ example: 'Кот', description: 'Перевод иностранной фразы' })
  readonly name: string;
}

export class GetTranslatePhraseDto {
  @ApiProperty({ example: "what's up, bro", description: 'Фраза для перевода' })
  readonly phrase: string;

  @ApiProperty({ example: 'english', description: 'Язык с которого переводят' })
  readonly from: Languages;

  @ApiProperty({ example: 'russian', description: 'Язык на который переводят' })
  readonly to: Languages;
}
