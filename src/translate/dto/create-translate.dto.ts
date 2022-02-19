import { ApiProperty } from '@nestjs/swagger';

export class CreateTranslateDto {
  @ApiProperty({ example: 'Кот', description: 'Перевод иностранной фразы' })
  readonly name: string;
}
