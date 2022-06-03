import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Dictionary } from './models/dictionary.model';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { Sequelize } from 'sequelize-typescript';
import { CardService } from 'src/card/card.service';
import { User } from 'src/user/models/user.model';
import { LanguageService } from 'src/language/language.service';
import { Language } from 'src/language/models/language.model';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel(Dictionary) private dictionaryRepository: typeof Dictionary,
    @Inject(REQUEST) private request: Request,
    @Inject(forwardRef(() => CardService))
    private cardService: CardService,
    private languageService: LanguageService,
  ) {}

  async createDictionary(dto: CreateDictionaryDto) {
    const userId = this.request.user.id;

    this.languageService.findByName(dto.from);

    const fromLanguage = await this.languageService.findOrCreate(dto.from);
    const toLanguage = await this.languageService.findOrCreate(dto.to);

    const isExistDictionary = await this.checkExistDictionary(
      userId,
      dto.name,
      fromLanguage.id,
      toLanguage.id,
    );
    if (isExistDictionary) {
      throw new HttpException(
        'У вас уже есть такой словарь',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dictionary = await this.dictionaryRepository.create({
      ...dto,
      from_id: fromLanguage.id,
      to_id: toLanguage.id,
      isCopy: false,
      user_id: userId,
    });
    return dictionary;
  }

  async getAllByUserId(userId: number = this.request.user.id) {
    const dictionaries = await this.dictionaryRepository.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        { model: Language, as: 'fromLanguage' },
        { model: Language, as: 'toLanguage' },
      ],
    });

    return dictionaries;
  }

  async addPublicDictionary(publicDictionaryId: number) {
    const userId = this.request.user.id;

    const dictionary = await this.getOneById(publicDictionaryId);

    const isExistDictionary = await this.checkExistDictionary(
      userId,
      dictionary.name,
      dictionary.from_id,
      dictionary.to_id,
    );
    if (isExistDictionary) {
      throw new HttpException(
        'У вас уже есть такой словарь',
        HttpStatus.BAD_REQUEST,
      );
    }

    const copyDictionary = await this.dictionaryRepository.create({
      name: dictionary.name,
      description: dictionary.description,
      from_id: dictionary.from_id,
      to_id: dictionary.to_id,
      private: true,
      isCopy: true,
      user_id: userId,
    });

    const cards = await this.cardService.getAllByDictionary(dictionary.id);
    for (const card of cards) {
      await this.cardService.copyCardToDictionary(card.id, copyDictionary.id);
    }

    return copyDictionary;
  }

  async getAllPublic() {
    const dictionaries = await this.dictionaryRepository.findAll({
      where: { private: false },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        { model: Language, as: 'fromLanguage' },
        { model: Language, as: 'toLanguage' },
      ],
    });

    return dictionaries;
  }

  async getAllPublicByUserId(userId: number) {
    const dictionaries = await this.dictionaryRepository.findAll({
      where: { user_id: userId, private: false },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        { model: Language, as: 'fromLanguage' },
        { model: Language, as: 'toLanguage' },
      ],
    });

    return dictionaries;
  }

  async getOneById(dictionaryId: number) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id: dictionaryId },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        { model: Language, as: 'fromLanguage' },
        { model: Language, as: 'toLanguage' },
      ],
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

    if (!dictionary) {
      throw new HttpException('Словаря не существует', HttpStatus.NOT_FOUND);
    }

    return dictionary ? true : false;
  }

  async changePrivate(dictionaryId: number) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { id: dictionaryId },
    });

    if (!dictionary) {
      throw new HttpException('Словаря не существует', HttpStatus.NOT_FOUND);
    }

    if (dictionary.isCopy) {
      throw new HttpException(
        'Этот словарь невозможно изменить',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    const updatedDictionary = await this.dictionaryRepository.update(
      // https://stackoverflow.com/questions/52283896/toggle-a-boolean-column-with-sequelize
      { private: Sequelize.literal('NOT private') },
      { where: { id: dictionaryId } },
    );

    return updatedDictionary;
  }

  async changeName(dictionaryId: number, dictionaryName: string) {
    const dictionary = await this.dictionaryRepository.update(
      { name: dictionaryName },
      { where: { id: dictionaryId } },
    );

    return dictionary;
  }

  async changeDescription(dictionaryId: number, dictionaryDescription: string) {
    const dictionary = await this.dictionaryRepository.update(
      { description: dictionaryDescription },
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
    fromId: number,
    toId: number,
  ) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { user_id: userId, name, from_id: fromId, to_id: toId },
    });

    return dictionary ? dictionary.id : false;
  }
}
