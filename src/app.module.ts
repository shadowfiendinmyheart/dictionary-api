import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/models/user.model';
import { UserModule } from './user/user.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { Dictionary } from './dictionary/models/dictionary.model';
import { AuthModule } from './auth/auth.module';
import { PhraseModule } from './phrase/phrase.module';
import { TranslateModule } from './translate/translate.module';
import { CardModule } from './card/card.module';
import { ImageModule } from './image/image.module';
import { Card } from './card/models/card.model';
import { Phrase } from './phrase/models/phrase.model';
import { Translate } from './translate/models/translate.model';
import { Image } from './image/models/image.model';
import { CardAssociation } from './card/models/cardAssociation.model';
import { Association } from './card/models/association.model';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Dictionary,
        Phrase,
        Image,
        Translate,
        Card,
        Association,
        CardAssociation,
      ],
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
    UserModule,
    DictionaryModule,
    AuthModule,
    PhraseModule,
    TranslateModule,
    CardModule,
    ImageModule,
  ],
})
export class AppModule {}
