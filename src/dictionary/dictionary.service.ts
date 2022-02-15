import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Dictionary } from './dictionary.model';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel(Dictionary) private dictionaryRepository: typeof Dictionary,
    @Inject(REQUEST) private request: Request,
  ) {}

  async createDictionary(dto: CreateDictionaryDto) {
    const userId = this.request.user.id;

    const isExistDictionary = await this.checkDictionary(userId, dto.name, dto.language);
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

  async getAllDictionary() {
    const userId = this.request.user.id;
    const dictionary = await this.dictionaryRepository.findAll({
      where: { user_id: userId },
    });
    return dictionary;
  }

  async getDictionaryByName(name: string) {
    const userId = this.request.user.id;
    const dictionary = await this.dictionaryRepository.findOne({
      where: { user_id: userId, name },
    });
    return dictionary;
  }

  private async checkDictionary(userId: number, name: string, language: string) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { user_id: userId, name, language },
    });
    
    return dictionary ? dictionary.id : false;
  }
}
