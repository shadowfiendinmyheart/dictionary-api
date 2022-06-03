import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Languages } from 'src/translate/types';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './models/language.model';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language) private readonly languageRepository: typeof Language,
  ) {}

  async create(dto: CreateLanguageDto) {
    const language = await this.languageRepository.create(dto);
    return language;
  }

  async findOrCreate(name: Languages) {
    const [language, languageCreated] =
      await this.languageRepository.findOrCreate({
        where: { name },
        defaults: {
          name,
        },
      });

    return language;
  }

  async findByName(name: Languages) {
    const language = await this.languageRepository.findOne({ where: { name } });
    return language;
  }

  findAll() {
    return `This action returns all language`;
  }

  findOne(id: number) {
    return `This action returns a #${id} language`;
  }

  update(id: number, updateLanguageDto: UpdateLanguageDto) {
    return `This action updates a #${id} language`;
  }

  remove(id: number) {
    return `This action removes a #${id} language`;
  }
}
