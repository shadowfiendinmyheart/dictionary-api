import { ApiProperty } from '@nestjs/swagger';

export class CreatePhraseDto {
  @ApiProperty({ example: 'Cat', description: 'Иностранная фраза' })
  readonly name: string;
}
