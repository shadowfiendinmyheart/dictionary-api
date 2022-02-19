import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
    @InjectModel(Card) private translateRepository: typeof Card,
    @InjectModel(CardAssociation)
    private cardAssociationRepository: typeof CardAssociation,
    private phraseService: PhraseService,
    private translateService: TranslateService,
    private imageService: ImageService,
  ) {}

  async create(dto: CreateCardDto) {
    const isPhraseExist = await this.phraseService.getPhraseByName(dto.phrase);
    const phrase = isPhraseExist
      ? isPhraseExist
      : await this.phraseService.create({ name: dto.phrase });

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

        return { translate, image };
      }),
    );
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
