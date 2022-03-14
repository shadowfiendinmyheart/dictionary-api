import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Image } from 'src/image/models/image.model';
import { Translate } from 'src/translate/models/translate.model';
import { Card } from '../../card/models/card.model';
import { CardAssociation } from '../../card/models/cardAssociation.model';

@Table({ tableName: 'association' })
export class Association extends Model<Association> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @BelongsToMany(() => Card, () => CardAssociation)
  cards: Card[];

  @ForeignKey(() => Translate)
  @Column({ type: DataType.INTEGER, allowNull: false })
  translate_id: number;

  @BelongsTo(() => Translate)
  translate: Translate;

  @ForeignKey(() => Image)
  @Column
  image_id: number;

  @BelongsTo(() => Image)
  image: Image;

  // TODO: find way to make it clear
  // for 'description: association.CardAssociation.description' in cardservice.makePrettyCards
  CardAssociation: CardAssociation;
}
