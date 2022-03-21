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
    const request = await reverso.getContext(dto.phrase, dto.from, dto.to);

    return request;
  }
}
