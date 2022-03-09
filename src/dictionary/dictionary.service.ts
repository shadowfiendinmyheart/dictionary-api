import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Dictionary } from './models/dictionary.model';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel(Dictionary) private dictionaryRepository: typeof Dictionary,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createDictionary(dto: CreateDictionaryDto) {
    const userId = this.request.user.id;

    const isExistDictionary = await this.checkExistDictionary(
      userId,
      dto.name,
      dto.language,
    );
    if (isExistDictionary) {
      throw new HttpException(
        'У вас уже есть такой словарь',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dictionary = await this.dictionaryRepository.create({
      ...dto,
      user_id: userId,
    });
    return dictionary;
  }

  async getAllByUserId(userId: number = this.request.user.id) {
    const dictionaries = await this.dictionaryRepository.findAll({
      where: { user_id: userId },
    });

    return dictionaries;
  }

  async getOneById(dictionaryId: number) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id: dictionaryId },
    });

    return dictionary;
  }

  async checkPrivate(dictionaryId: number, userId: number) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id: dictionaryId },
    });

    if (dictionary.private && userId !== dictionary.user_id) {
      throw new HttpException(
        'У вас нет доступа к данному словарю',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }

  async checkByUserId(userId: number, dictionaryId: number) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id: dictionaryId, user_id: userId },
    });

    return dictionary ? true : false;
  }

  async getAllPublic() {
    const dictionaries = await this.dictionaryRepository.findAll({
      where: { private: false },
    });

    return dictionaries;
  }

  async changePrivate(dictionaryId: number) {
    const dictionary = await this.dictionaryRepository.update(
      //https://stackoverflow.com/questions/52283896/toggle-a-boolean-column-with-sequelize
      { private: Sequelize.literal('NOT private') },
      { where: { id: dictionaryId } },
    );

    return dictionary;
  }

  async changeName(dictionaryId: number, dictionaryName: string) {
    const dictionary = await this.dictionaryRepository.update(
      { name: dictionaryName },
      { where: { id: dictionaryId } },
    );

    return dictionary;
  }

  async deleteById(dictionaryId: number) {
    const dictionary = await this.dictionaryRepository.destroy({
      where: { id: dictionaryId },
    });

    return dictionary;
  }

  private async checkExistDictionary(
    userId: number,
    name: string,
    language: string,
  ) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { user_id: userId, name, language },
    });

    return dictionary ? dictionary.id : false;
  }
}
