import { forwardRef, Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './models/card.model';
import { CardAssociation } from './models/cardAssociation.model';
import { Association } from '../association/entities/association.model';
import { PhraseModule } from 'src/phrase/phrase.module';
import { TranslateModule } from 'src/translate/translate.module';
import { ImageModule } from 'src/image/image.module';
import { AssociationModule } from 'src/association/association.module';
import { DictionaryModule } from 'src/dictionary/dictionary.module';
import { AuthModule } from 'src/auth/auth.module';
import { DescriptionModule } from 'src/description/description.module';

@Module({
  controllers: [CardController],
  providers: [CardService],
  imports: [
    SequelizeModule.forFeature([Card, CardAssociation, Association]),
    forwardRef(() => AuthModule),
    PhraseModule,
    TranslateModule,
    ImageModule,
    AssociationModule,
    forwardRef(() => DictionaryModule),
    DescriptionModule,
  ],
  exports: [CardService],
})
export class CardModule {}
