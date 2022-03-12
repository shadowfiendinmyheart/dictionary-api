import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AssociationService } from 'src/association/association.service';
import { ImageService } from 'src/image/image.service';
import { PhraseService } from 'src/phrase/phrase.service';
import { TranslateService } from 'src/translate/translate.service';
import { DictionaryService } from 'src/dictionary/dictionary.service';
import { Phrase } from 'src/phrase/models/phrase.model';
import { Card } from './models/card.model';
import { CardAssociation } from './models/cardAssociation.model';
import { Association } from 'src/association/entities/association.model';
import { Translate } from 'src/translate/models/translate.model';
import { Image } from 'src/image/models/image.model';
import { Dictionary } from 'src/dictionary/models/dictionary.model';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardCounterMode } from './types';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card) private cardRepository: typeof Card,
    @Inject(REQUEST) private request: Request,
    @InjectModel(CardAssociation)
    private cardAssociationRepository: typeof CardAssociation,
    private phraseService: PhraseService,
    private translateService: TranslateService,
    private imageService: ImageService,
    private associationService: AssociationService,
  ) {}

  async create(dto: CreateCardDto) {
    const phrase = await this.phraseService.findOrCreate(dto.phrase);

    const isCardExist = await this.checkExistCard(phrase.id, dto.dictionaryId);
    if (isCardExist) {
      throw new HttpException(
        'Такая карточка уже есть',
        HttpStatus.BAD_REQUEST,
      );
    }

    const associations = await Promise.all(
      dto.associations.map(async (associate) => {
        const translate = await this.translateService.findOrCreate(
          associate.translate,
        );
        const image = await this.imageService.findOrCreate(associate.image);
        const association = await this.associationService.findOrCreate({
          imageId: image.id,
          translateId: translate.id,
        });

        return association;
      }),
    );

    const card = await this.cardRepository.create({
      phrase_id: phrase.id,
      dictionary_id: dto.dictionaryId,
    });

    await Promise.all(
      associations.map(async (association) => {
        await this.cardAssociationRepository.create({
          card_id: card.id,
          assoctiation_id: association.id,
        });
      }),
    );

    return card;
  }

  async getAllByDictionary(dictionaryId: number) {
    const cards = await this.cardRepository.findAll({
      where: { dictionary_id: dictionaryId },
      include: [
        {
          model: Phrase,
        },
        {
          model: Association,
          include: [Image, Translate],
        },
      ],
    });

    return this.makePrettyCards(cards);
  }

  async getPaginationByDictionary(
    dictionaryId: number,
    page: number,
    size: number,
  ) {
    const pagination = await this.cardRepository.findAndCountAll({
      where: { dictionary_id: dictionaryId },
      limit: size,
      offset: page * size,
      include: [
        {
          model: Phrase,
        },
        {
          model: Association,
          include: [Image, Translate],
        },
      ],
    });

    return {
      count: pagination.count,
      cards: await this.makePrettyCards(pagination.rows),
    };
  }

  async getCounterByDictionary(
    dictionaryId: number,
    size: number,
    counter: number,
    mode: CardCounterMode,
  ) {
    const op = this.getOpByMode(mode);

    const cards = await this.cardRepository.findAll({
      where: {
        dictionary_id: dictionaryId,
        counter: {
          [op]: counter,
        },
      },
      order: [Sequelize.fn('RANDOM')],
      limit: size,
      include: [
        {
          model: Phrase,
        },
        {
          model: Association,
          include: [Image, Translate],
        },
      ],
    });

    return this.makePrettyCards(cards);
  }

  async getAllByUserId() {
    const userId = this.request.user.id;

    const cards = await this.cardRepository.findAll({
      include: [
        {
          model: Phrase,
        },
        {
          model: Association,
          include: [Image, Translate],
        },
        {
          model: Dictionary,
          where: {
            user_id: userId,
          },
        },
      ],
    });

    return this.makePrettyCards(cards);
  }

  async getOne(id: number) {
    const card = await this.cardRepository.findOne({
      where: { id },
      include: [Dictionary],
    });

    return card;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  async deleteById(cardId: number) {
    const dictionary = await this.cardRepository.destroy({
      where: { id: cardId },
    });

    return dictionary;
  }

  async checkPrivate(cardId: number, userId: number) {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      include: [Dictionary],
    });

    if (card.dictionary.private && userId !== card.dictionary.user_id) {
      throw new HttpException(
        'У вас нет доступа к данной карточке',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }

  private async checkExistCard(phraseId: number, dictionaryId: number) {
    const card = await this.cardRepository.findOne({
      where: { phrase_id: phraseId, dictionary_id: dictionaryId },
    });
    return card ? true : false;
  }

  private getOpByMode(mode: CardCounterMode) {
    switch (mode) {
      case CardCounterMode.GreaterThan:
        return Op.gt;

      case CardCounterMode.LessThan:
        return Op.lt;

      case CardCounterMode.Equals:
        return Op.eq;

      case CardCounterMode.GreaterOrEqual:
        return Op.gte;

      case CardCounterMode.LessOrEqual:
        return Op.lte;

      default:
        throw new HttpException('Неверный запрос', HttpStatus.BAD_REQUEST);
    }
  }

  private async makePrettyCards(cards: Card[]) {
    return cards.map((card) => {
      return {
        id: card.id,
        phrase: card.phrase.name,
        counter: card.counter,
        associations: card.associations.map((association) => {
          return {
            translate: association.translate.name,
            image: association.image.data,
          };
        }),
      };
    });
  }
}
