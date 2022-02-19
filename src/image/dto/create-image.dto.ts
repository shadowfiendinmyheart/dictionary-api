import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({ example: 'base 64', description: 'Изображение' })
  readonly data: string;
}
