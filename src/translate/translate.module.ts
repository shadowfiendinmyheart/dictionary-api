import { forwardRef, Module } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateController } from './translate.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Translate } from './models/translate.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TranslateController],
  providers: [TranslateService],
  imports: [
    SequelizeModule.forFeature([Translate]),
    forwardRef(() => AuthModule),
  ],
  exports: [TranslateService],
})
export class TranslateModule {}
