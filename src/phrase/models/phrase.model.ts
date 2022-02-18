import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Card } from 'src/card/models/card.model';

@Table({ tableName: 'phrase' })
export class Phrase extends Model<Phrase> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'cat',
    description: 'Фраза или слово на иностранном языке',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => Card)
  cards: Card[];
}
