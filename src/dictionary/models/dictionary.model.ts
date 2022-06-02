import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Length,
  Model,
  Table,
} from 'sequelize-typescript';
import { Card } from 'src/card/models/card.model';
import { Languages } from 'src/translate/types';
import { User } from 'src/user/models/user.model';

@Table({ tableName: 'dictionary' })
export class Dictionary extends Model<Dictionary> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Фауна Африки', description: 'Название словаря' })
  @Length({ min: 2, max: 128 })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;

  @ApiProperty({
    example: 'Список животных африки для начального изучения',
    description: 'Описание словаря',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  description: string;

  @ApiProperty({ example: 'english', description: 'Язык с которого переводят' })
  @Column({ type: DataType.STRING, allowNull: false })
  from: Languages;

  @ApiProperty({ example: 'russian', description: 'Язык на который переводят' })
  @Column({ type: DataType.STRING, allowNull: false })
  to: Languages;

  @ApiProperty({
    example: 'true',
    description: 'Виден ли словарь другим пользователям',
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  private: boolean;

  @ApiProperty({
    example: 'false',
    description: 'Является ли словарь копией',
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isCopy: boolean;

  @ApiProperty({
    example: '1',
    description:
      'Уникальный идентификатор пользователя, которому принадлежит словарь',
  })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Card)
  cards: Card[];
}
