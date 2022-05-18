import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Card } from 'src/card/models/card.model';
import { CardAssociation } from 'src/card/models/cardAssociation.model';

@Table({ tableName: 'description' })
export class Description extends Model<Description> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Cat - катарсис - кот',
    description: 'Описание ассоциации',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @HasMany(() => Card)
  cards: Card[];

  @HasMany(() => CardAssociation)
  card_associations: CardAssociation[];
}
