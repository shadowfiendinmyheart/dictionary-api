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
import { Dictionary } from 'src/dictionary/models/dictionary.model';
import { Phrase } from 'src/phrase/models/phrase.model';
import { Association } from './association.model';
import { CardAssociation } from './cardAssociation.model';

@Table({ tableName: 'card' })
export class Card extends Model<Card> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '1',
    description: 'Счетчик по количеству правильных ответов на карточке',
  })
  @Column({ type: DataType.INTEGER, allowNull: false })
  counter: number;

  @ForeignKey(() => Phrase)
  @Column({ type: DataType.INTEGER, allowNull: false })
  phrase_id: number;

  @BelongsTo(() => Phrase)
  phrase: Phrase;

  @BelongsToMany(() => Association, () => CardAssociation)
  associations: Association[];

  @ForeignKey(() => Dictionary)
  @Column({ type: DataType.INTEGER, allowNull: false })
  dictionary_id: number;

  @BelongsTo(() => Dictionary)
  dictionary: Dictionary;
}