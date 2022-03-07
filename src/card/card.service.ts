import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssociationService } from 'src/association/association.service';
import { ImageService } from 'src/image/image.service';
import { Phrase } from 'src/phrase/models/phrase.model';
import { PhraseService } from 'src/phrase/phrase.service';
import { TranslateService } from 'src/translate/translate.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './models/card.model';
import { CardAssociation } from './models/cardAssociation.model';
import { Association } from 'src/association/entities/association.model';
import { Translate } from 'src/translate/models/translate.model';
import { Image } from 'src/image/models/image.model';
import { Dictionary } from 'src/dictionary/models/dictionary.model';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DictionaryService } from 'src/dictionary/dictionary.service';

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

    return {
      id: card.id,
      counter: card.counter,
    };
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

    const prettyCards = cards.map((card) => {
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

    return prettyCards;
  }

  findAll() {
    return `This action returns all card`;
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOne({
      where: { id },
      include: [Dictionary],
    });

    return card;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
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
}
