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

@Injectable()
export class DictionaryService {
  constructor(
    @InjectModel(Dictionary) private dictionaryRepository: typeof Dictionary,
    @Inject(REQUEST) private request: Request,
    @Inject(forwardRef(() => CardService))
    private cardService: CardService,
  ) {}

  async createDictionary(dto: CreateDictionaryDto) {
    const userId = this.request.user.id;

    const isExistDictionary = await this.checkExistDictionary(
      userId,
      dto.name,
      dto.from,
      dto.to,
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

  async addPublicDictionary(publicDictionaryId: number) {
    const userId = this.request.user.id;

    const dictionary = await this.getOneById(publicDictionaryId);

    const isExistDictionary = await this.checkExistDictionary(
      userId,
      dictionary.name,
      dictionary.from,
      dictionary.to,
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
      to: dictionary.to,
      from: dictionary.from,
      private: true,
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
    });

    return dictionaries;
  }

  async getAllPublicByUserId(userId: number) {
    const dictionaries = await this.dictionaryRepository.findAll({
      where: { user_id: userId, private: false },
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

    if (!dictionary) {
      throw new HttpException('Словаря не существует', HttpStatus.NOT_FOUND);
    }

    return dictionary ? true : false;
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
    from: string,
    to: string,
  ) {
    const dictionary = await this.dictionaryRepository.findOne({
      where: { user_id: userId, name, from, to },
    });

    return dictionary ? dictionary.id : false;
  }
}
