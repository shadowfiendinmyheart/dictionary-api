import { ApiProperty } from '@nestjs/swagger';

export class CreateImageFileDto {
  @ApiProperty({
    example:
      'https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c0/Pudge_icon.png/revision/latest/scale-to-width-down/256?cb=20160411211506',
    description: 'Url путь к изображению',
  })
  readonly url: string;

  @ApiProperty({
    example: 'UsernameWordDictionaryLanguageTimestamp',
    description: 'GarfieldCatMostusablewordsEng1234567890',
  })
  readonly publicId: string;
}
