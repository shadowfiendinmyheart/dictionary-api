import { Module } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateController } from './translate.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Translate } from './models/translate.model';

@Module({
  controllers: [TranslateController],
  providers: [TranslateService],
  imports: [
    SequelizeModule.forFeature([Translate]),
  ],
  exports: [TranslateService]
})
export class TranslateModule {}
