import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Phrase } from './models/phrase.model';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';

@Module({
  controllers: [PhraseController],
  providers: [PhraseService],
  imports: [SequelizeModule.forFeature([Phrase])],
  exports: [PhraseService],
})
export class PhraseModule {}
