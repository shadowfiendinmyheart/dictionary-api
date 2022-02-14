import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dictionary } from './dictionary.model';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel(Dictionary) private dictionaryRepository: typeof Dictionary,
  ) {}

  async createDictionary(dto: CreateDictionaryDto) {
    const dictionary = await this.dictionaryRepository.create(dto);
    return dictionary;
  }

  async getDictionaries(id: number) {
    const dictionary = await this.dictionaryRepository.findAll({
      where: { user_id: id },
    });
    return dictionary;
  }
}
