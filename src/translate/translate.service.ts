// eslint-disable-next-line @typescript-eslint/no-var-requires
const Reverso = require('reverso-api');
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateTranslateDto,
  GetTranslatePhraseDto,
} from './dto/create-translate.dto';
import { UpdateTranslateDto } from './dto/update-translate.dto';
import { Translate } from './models/translate.model';
import { TranslationsResponse } from './types';

const reverso = new Reverso();

@Injectable()
export class TranslateService {
  constructor(
    @InjectModel(Translate)
    private readonly translateRepository: typeof Translate,
  ) {}

  async create(dto: CreateTranslateDto) {
    const translate = await this.translateRepository.create(dto);
    return translate;
  }

  async getTranslateByName(name: string) {
    const translate = await this.translateRepository.findOne({
      where: { name },
    });
    return translate;
  }

  async findOrCreate(name: string) {
    const [translate, translateCreated] =
      await this.translateRepository.findOrCreate({
        where: { name },
        defaults: {
          name,
        },
      });

    return translate;
  }

  findAll() {
    return `This action returns all translate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} translate`;
  }

  update(id: number, updateTranslateDto: UpdateTranslateDto) {
    return `This action updates a #${id} translate`;
  }

  remove(id: number) {
    return `This action removes a #${id} translate`;
  }

  async translatePhrase(dto: GetTranslatePhraseDto) {
    try {
      const request: TranslationsResponse = await reverso.getContext(
        dto.phrase,
        dto.from,
        dto.to,
      );
      // delete "Show more"
      request.translation = request.translation.slice(0, -1);
      request.translation = request.translation.map((t) => {
        // api returns extra letters for some words
        const extraLetter = t.slice(-2);
        if (
          extraLetter === ' f' ||
          extraLetter === ' m' ||
          extraLetter === ' n'
        ) {
          return t.slice(0, -2);
        }
        return t;
      });
      return request;
    } catch (error) {
      console.log('error translatePhrase', error);
    }
  }
}
