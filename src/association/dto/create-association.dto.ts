import { ApiProperty } from '@nestjs/swagger';

export class CreateAssociationDto {
  @ApiProperty({ example: '1', description: 'Id перевода' })
  readonly translateId: number;

  @ApiProperty({ example: '1', description: 'Id изображения' })
  readonly imageId: number;
}
