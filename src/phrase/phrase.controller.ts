import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { PhraseService } from './phrase.service';

@ApiTags('Фраза на иностранном языке')
@Controller('phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  @Post()
  create(@Body() createTranslateDto: CreatePhraseDto) {
    return this.phraseService.create(createTranslateDto);
  }
}
