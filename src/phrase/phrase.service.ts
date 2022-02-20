import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { Phrase } from './models/phrase.model';
import { Op } from 'sequelize';

@Injectable()
export class PhraseService {
  constructor(@InjectModel(Phrase) private phraseRepository: typeof Phrase) {}

  async create(dto: CreatePhraseDto) {
    const phrase = await this.phraseRepository.create(dto);
    return phrase;
  }

  async getPhraseByName(name: string) {
    const phrase = await this.phraseRepository.findOne({
      where: { name },
    });
    return phrase;
  }

  async getPhraseById(id: number) {
    const phrase = await this.phraseRepository.findOne({
      where: { id },
    });
    return phrase;
  }

  async getPhrasesByIds(ids: number[]) {
    const phrase = await this.phraseRepository.findAll({
      where: {
        id: {
          [Op.or]: ids,
        },
      },
    });
    return phrase;
  }

  async findOrCreate(name: string) {
    const [phrase, phraseCreated] = await this.phraseRepository.findOrCreate({
      where: { name },
      defaults: {
        name,
      },
    });

    return phrase;
  }
}
