import { forwardRef, Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { User } from 'src/user/models/user.model';
import { Dictionary } from './models/dictionary.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService],
  imports: [
    SequelizeModule.forFeature([Dictionary, User]),
    forwardRef(() => AuthModule),
  ],
  exports: [DictionaryService],
})
export class DictionaryModule {}
