import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { User } from 'src/user/user.model';
import { Dictionary } from './dictionary.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService],
  imports: [SequelizeModule.forFeature([Dictionary, User])],
})
export class DictionaryModule {}
