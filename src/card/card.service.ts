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
import { DescriptionService } from 'src/description/description.service';
import { Description } from 'src/description/models/description.model';

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
    private descriptionService: DescriptionService,
  ) {}

  async create(dto: CreateCardDto) {
    const phrase = await this.phraseService.findOrCreate(dto.phrase);
    const description = await this.descriptionService.findOrCreate(
      dto.description,
    );

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

    const associationItems = await Promise.all(
      dto.associations.map(async (association) => {
        const createdTranslations = await Promise.all(
          association.translate.map((translate) => {
            return this.translateService.findOrCreate(translate);
          }),
        );

        const createdImage = await this.imageService.findOrCreate(
          association.image,
        );

        const createdAssociations = await Promise.all(
          createdTranslations.map(async (translation) => {
            return await this.associationService.findOrCreate({
              imageId: createdImage.id,
              translateId: translation.id,
            });
          }),
        );

        return {
          associationIds: createdAssociations.map(
            (association) => association.id,
          ),
          description: association.description,
        };
      }),
    );

    const card = await this.cardRepository.create({
      phrase_id: phrase.id,
      description_id: description.id,
      dictionary_id: dto.dictionaryId,
    });

    await Promise.all(
      associationItems.map(async (association) => {
        const description = await this.descriptionService.findOrCreate(
          association.description,
        );

        for (const associationId of association.associationIds) {
          await this.cardAssociationRepository.create({
            description_id: description.id,
            card_id: card.id,
            assoctiation_id: associationId,
          });
        }
      }),
    );

    return card;
  }

  async getAllByDictionary(dictionaryId: number) {
    const cards = await this.cardRepository.findAll({
      where: { dictionary_id: dictionaryId },
      include: [
        Phrase,
        Description,
        {
          model: Association,
          include: [Image, Translate],
        },
      ],
    });

    return cards.map((card) => this.makePrettyCard(card));
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
        Phrase,
        Description,
        {
          model: Association,
          include: [Image, Translate],
        },
      ],
    });

    return {
      count: pagination.count,
      cards: pagination.rows.map((card) => this.makePrettyCard(card)),
    };
  }

  async getCardsByCounter(
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
        Phrase,
        Description,
        {
          model: Association,
          include: [Image, Translate],
        },
      ],
    });

    return cards.map((card) => this.makePrettyCard(card));
  }

  async getAllByUserId() {
    const userId = this.request.user.id;

    const cards = await this.cardRepository.findAll({
      include: [
        Phrase,
        Description,
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

    return cards.map((card) => this.makePrettyCard(card));
  }

  async getOne(id: number) {
    const card = await this.cardRepository.findOne({
      where: { id },
      include: [
        Dictionary,
        Description,
        Phrase,
        {
          model: Association,
          include: [Image, Translate],
        },
      ],
    });

    return this.makePrettyCard(card);
  }

  async changePhrase(id: number, cardPhrase: string) {
    const newPhrase = await this.phraseService.findOrCreate(cardPhrase);
    const updatedCard = await this.cardRepository.update(
      { phrase_id: newPhrase.id },
      { where: { id } },
    );

    return updatedCard;
  }

  async changeDescription(id: number, newDescription: string) {
    const description = await this.descriptionService.findOrCreate(
      newDescription,
    );
    const updatedCard = await this.cardRepository.update(
      { description_id: description.id },
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

    const description = await this.descriptionService.findOrCreate(
      dto.description,
    );
    const cardAssociation = this.cardAssociationRepository.create({
      description_id: description.id,
      assoctiation_id: association.id,
      card_id: cardId,
    });

    return cardAssociation;
  }

  async changeAssociationDescription(
    id: number,
    associationDescription: string,
  ) {
    const description = await this.descriptionService.findOrCreate(
      associationDescription,
    );
    const cardAssociation = await this.cardAssociationRepository.update(
      { description_id: description.id },
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

  private makePrettyCard(card: Card) {
    return {
      id: card.id,
      phrase: card.phrase.name,
      description: card.description.text,
      counter: card.counter,
      associations: card.associations.reduce((prev, association) => {
        const findedIndex = prev.findIndex((p) => {
          return (
            p.image === association.image.data &&
            p.description_id === association.CardAssociation.description_id
          );
        });

        if (findedIndex > -1) {
          prev[findedIndex].translate = [
            ...prev[findedIndex].translate,
            association.translate.name,
          ];
          return prev;
        }

        return [
          ...prev,
          {
            id: association.id,
            description_id: association.CardAssociation.description_id,
            translate: [association.translate.name],
            image: association.image.data,
          },
        ];
      }, []),
    };
  }
}
