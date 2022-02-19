import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTranslateDto } from './dto/create-translate.dto';
import { UpdateTranslateDto } from './dto/update-translate.dto';
import { Translate } from './models/translate.model';

@Injectable()
export class TranslateService {
  constructor(
    @InjectModel(Translate) private readonly translateRepository: typeof Translate
  ) { }

  async create(dto: CreateTranslateDto) {
    const translate = await this.translateRepository.create(dto);
    return translate;
  }

  async getPhraseByName(name: string) {
    const translate = await this.translateRepository.findOne({
      where: { name }
    });
    return translate ? translate : false;
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
}
