import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from './card.model';
import { Association } from '../../association/entities/association.model';

@Table({ tableName: 'card_association', timestamps: false })
export class CardAssociation extends Model<CardAssociation> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  counter: number;

  @BelongsTo(() => Card)
  card: Card;

  @ForeignKey(() => Card)
  @Column
  card_id: number;

  @BelongsTo(() => Association)
  association: Association;

  @ForeignKey(() => Association)
  @Column
  assoctiation_id: number;
}
