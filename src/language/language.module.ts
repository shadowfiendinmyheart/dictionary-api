import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Language } from './models/language.model';

@Module({
  controllers: [LanguageController],
  providers: [LanguageService],
  imports: [SequelizeModule.forFeature([Language])],
  exports: [LanguageService],
})
export class LanguageModule {}
