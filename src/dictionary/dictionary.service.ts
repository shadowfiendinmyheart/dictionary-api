import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Dictionary } from './models/dictionary.model';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';

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
    const dictionary = await this.dictionaryRepository.findAll({
      where: { user_id: userId },
    });
    return dictionary;
  }

  async getOneById(dictionaryId: number) {
    const userId = this.request.user.id;
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id: dictionaryId },
    });
    this.checkPrivate(dictionary, userId);

    return dictionary;
  }

  async checkPrivate(dictionary: Dictionary, userId: number) {
    if (dictionary.private && userId !== dictionary.user_id) {
      throw new HttpException(
        'У вас нет доступа к данному словарю',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async checkByUserId(userId: number, dictionaryId: number) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id: dictionaryId, user_id: userId },
    });

    return dictionary ? true : false;
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
