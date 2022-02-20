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
import { Op } from 'sequelize';
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
    private dictionaryService: DictionaryService
  ) {}

  async create(dto: CreateCardDto) {
    // TODO: transaction
    const phrase = await this.phraseService.findOrCreate(dto.phrase);

    const isCardExist = await this.checkCard(phrase.id, dto.dictionaryId);
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
      counter: 0,
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

  private async checkCard(phraseId: number, dictionaryId: number) {
    const card = await this.cardRepository.findOne({
      where: { phrase_id: phraseId, dictionary_id: dictionaryId },
    });
    return card ? true : false;
  }

  async getAllCardsPhraseInDictionary(dictionaryId: number) {
    const cardsWithPhrase = await this.cardRepository.findAll({
      where: { dictionary_id: dictionaryId },
      include: Phrase,
    });

    return cardsWithPhrase;
  }

  async getAllCardAssociationsInDictionary(dictionaryId: number) {
    const cardsWithPhrase = await this.getAllCardsPhraseInDictionary(dictionaryId);
    const cardIds = cardsWithPhrase.map((card) => card.id);

    const cardAssociations = await this.cardAssociationRepository.findAll({
      where: {
        card_id: {
          [Op.or]: cardIds,
        },
      },
      include: {
        model: Association,
        include: [Image, Translate],
      },
    });

    const output = cardsWithPhrase.map((card) => {
      return {
        card_id: card.id,
        phrase: card.phrase.name,
        counter: card.counter,
        assoctions: cardAssociations.reduce(
          (result, cardAssociation) => {
            if (cardAssociation.card_id === card.id) {
              result.push({
                translate: cardAssociation.association.translate.name,
                image: cardAssociation.association.image.data,
              });
            }
            return result;
          }, []),
      };
    });

    return output;
  }

  findAll() {
    return `This action returns all card`;
  }

  async findOne(id: number) {
    const userId = this.request.user.id;
    const card = await this.cardRepository.findOne({
      where: { id },
      include: [Dictionary]
    });

    await this.dictionaryService.checkPrivate(card.dictionary, userId);
    return card ;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
