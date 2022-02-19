import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { Phrase } from './models/phrase.model';

@Injectable()
export class PhraseService {
  constructor(
    @InjectModel(Phrase) private readonly phraseRepository: typeof Phrase
  ) { }

  async create(dto: CreatePhraseDto) {
    const phrase = await this.phraseRepository.create(dto);
    return phrase;
  }

  async getPhraseByName(name: string) {
    const phrase = await this.phraseRepository.findOne({
      where: { name }
    });
    return phrase ? phrase : false;
  }
}
