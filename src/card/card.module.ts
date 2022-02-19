import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './models/card.model';
import { CardAssociation } from './models/cardAssociation.model';
import { Association } from '../association/entities/association.model';
import { PhraseModule } from 'src/phrase/phrase.module';
import { TranslateModule } from 'src/translate/translate.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  controllers: [CardController],
  providers: [CardService],
  imports: [
    SequelizeModule.forFeature([Card, CardAssociation, Association]),
    PhraseModule,
    TranslateModule,
    ImageModule,
  ],
  exports: [CardService],
})
export class CardModule {}
