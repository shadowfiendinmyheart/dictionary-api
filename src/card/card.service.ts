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
import { UpdateAssociationsCardDto } from './dto/update-card.dto';
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
    private dictionaryService: DictionaryService,
  ) {}

  async create(dto: CreateCardDto) {
    const phrase = await this.phraseService.findOrCreate(dto.phrase);

    const isCardExist = await this.checkByPhraseInDictionary(
      phrase.id,
      dto.dictionaryId,
    );
    if (isCardExist) {
      throw new HttpException(
        'Такая карточка уже есть',
        HttpStatus.BAD_REQUEST,
      );
    }

    const associations = await Promise.all(
      dto.associations.map(async (association) => {
        const createdTranslate = await this.translateService.findOrCreate(
          association.translate,
        );
        const createdImage = await this.imageService.findOrCreate(
          association.image,
        );
        const createdAssociation = await this.associationService.findOrCreate({
          imageId: createdImage.id,
          translateId: createdTranslate.id,
        });

        return {
          id: createdAssociation.id,
          description: association.description,
        };
      }),
    );

    const card = await this.cardRepository.create({
      phrase_id: phrase.id,
      description: dto.description,
      dictionary_id: dto.dictionaryId,
    });

    await Promise.all(
      associations.map(async (association) => {
        await this.cardAssociationRepository.create({
          description: association.description,
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
      include: [Dictionary, Association],
    });

    return card;
  }

  async changePhrase(id: number, cardPhrase: string) {
    const newPhrase = await this.phraseService.findOrCreate(cardPhrase);
    const updatedCard = await this.cardRepository.update(
      { phrase_id: newPhrase.id },
      { where: { id } },
    );

    return updatedCard;
  }

  async changeDescription(id: number, cardDescription: string) {
    const updatedCard = await this.cardRepository.update(
      { description: cardDescription },
      { where: { id } },
    );

    return updatedCard;
  }

  async increaseCounter(id: number) {
    const updatedCard = await this.cardRepository.increment('counter', {
      by: 1,
      where: { id },
    });

    return updatedCard;
  }

  async deleteById(cardId: number) {
    const deletedCard = await this.cardRepository.destroy({
      where: { id: cardId },
    });

    return deletedCard;
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

  async checkByUserId(userId: number, cardId: number) {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      include: [Dictionary],
    });

    if (!card) {
      throw new HttpException('Карточки не существует', HttpStatus.NOT_FOUND);
    }

    return this.dictionaryService.checkByUserId(userId, card.dictionary.id);
  }

  async checkCardAssociationByUserId(
    userId: number,
    cardAssociationId: number,
  ) {
    const cardAssociation = await this.cardAssociationRepository.findOne({
      where: { id: cardAssociationId },
      include: [Card],
    });

    if (!cardAssociation) {
      throw new HttpException('Ассоциации не существует', HttpStatus.NOT_FOUND);
    }

    return this.checkByUserId(userId, cardAssociation.card.id);
  }

  async addAssociation(cardId: number, dto: UpdateAssociationsCardDto) {
    const translate = await this.translateService.findOrCreate(dto.name);
    const image = await this.imageService.findOrCreate(dto.data);
    const association = await this.associationService.findOrCreate({
      imageId: image.id,
      translateId: translate.id,
    });

    const cardAssociation = this.cardAssociationRepository.create({
      description: dto.description,
      assoctiation_id: association.id,
      card_id: cardId,
    });

    return cardAssociation;
  }

  async changeAssociationDescription(
    id: number,
    associationDescription: string,
  ) {
    const cardAssociation = await this.cardAssociationRepository.update(
      { description: associationDescription },
      { where: { id } },
    );

    return cardAssociation;
  }

  async deleteAssociation(cardId: number, associationId: number) {
    const deletedAssociation = await this.cardAssociationRepository.destroy({
      where: { card_id: cardId, assoctiation_id: associationId },
    });

    return deletedAssociation;
  }

  private async checkByPhraseInDictionary(
    phraseId: number,
    dictionaryId: number,
  ) {
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
        description: card.description,
        counter: card.counter,
        associations: card.associations.map((association) => {
          return {
            id: association.id,
            description: association.CardAssociation.description,
            translate: association.translate.name,
            image: association.image.data,
          };
        }),
      };
    });
  }
}
