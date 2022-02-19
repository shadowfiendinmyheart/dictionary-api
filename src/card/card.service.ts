import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssociationService } from 'src/association/association.service';
import { ImageService } from 'src/image/image.service';
import { PhraseService } from 'src/phrase/phrase.service';
import { TranslateService } from 'src/translate/translate.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './models/card.model';
import { CardAssociation } from './models/cardAssociation.model';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card) private cardRepository: typeof Card,
    @InjectModel(CardAssociation)
    private cardAssociationRepository: typeof CardAssociation,
    private phraseService: PhraseService,
    private translateService: TranslateService,
    private imageService: ImageService,
    private associationService: AssociationService,
  ) {}

  async create(dto: CreateCardDto) {
    // TODO: transaction & decompose
    const isPhraseExist = await this.phraseService.getPhraseByName(dto.phrase);
    const phrase = isPhraseExist
      ? isPhraseExist
      : await this.phraseService.create({ name: dto.phrase });

    const isCardExist = await this.checkCard(phrase.id, dto.dictionaryId);
    if (isCardExist) {
      throw new HttpException(
        'Такая карточка уже есть',
        HttpStatus.BAD_REQUEST,
      );
    }

    const associations = await Promise.all(
      dto.associations.map(async (associate) => {
        const isTranslateExist = await this.translateService.getTranslateByName(
          associate.translate,
        );
        const translate = isTranslateExist
          ? isTranslateExist
          : await this.translateService.create({ name: associate.translate });

        const isImageExist = await this.imageService.getImageByData(
          associate.image,
        );
        const image = isImageExist
          ? isImageExist
          : await this.imageService.create({ data: associate.image });

        const isAssociationExist = await this.associationService.getAssociation(
          { imageId: image.id, translateId: translate.id },
        );

        const association = isAssociationExist
          ? isAssociationExist
          : await this.associationService.create({
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

  findAll() {
    return `This action returns all card`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
