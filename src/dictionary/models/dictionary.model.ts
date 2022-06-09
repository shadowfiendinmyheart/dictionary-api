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
import { Language } from 'src/language/models/language.model';
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
  @Length({ max: 500 })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  description: string;

  @ApiProperty({ example: '1', description: 'Id языка с которого переводят' })
  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER, allowNull: false })
  from_id: number;

  @BelongsTo(() => Language, 'from_id')
  fromLanguage: Language;

  @ApiProperty({ example: '2', description: 'Id языка на который переводят' })
  @ForeignKey(() => Language)
  @Column({ type: DataType.INTEGER, allowNull: false })
  to_id: number;

  @BelongsTo(() => Language, 'to_id')
  toLanguage: Language;

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
  is_copy: boolean;

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
