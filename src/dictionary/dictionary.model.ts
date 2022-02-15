import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/user/user.model';

interface DictionaryCreationAttrs {
  name: string;
  language: string;
  user_id: number;
}

@Table({ tableName: 'dictionary' })
export class Dictionary extends Model<Dictionary, DictionaryCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'animals', description: 'Название словаря' })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;

  @ApiProperty({ example: 'english', description: 'Язык словаря' })
  @Column({ type: DataType.STRING, allowNull: false })
  language: string;

  @ApiProperty({
    example: 'true',
    description: 'Виден ли словарь другим пользователям',
  })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  private: boolean;

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
}
