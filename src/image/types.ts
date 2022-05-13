import { ApiProperty } from '@nestjs/swagger';

export class getImagesFromOuterApiQuery {
  @ApiProperty({
    example: 'cat',
    description: 'Поиск изображений по строке',
  })
  text: string;
}
