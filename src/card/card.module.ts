import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Card } from './models/card.model';
import { CardAssociation } from './models/cardAssociation.model';
import { Association } from './models/association.model';

@Module({
  controllers: [CardController],
  providers: [CardService],
  imports: [SequelizeModule.forFeature([Card, CardAssociation, Association])],
})
export class CardModule {}
