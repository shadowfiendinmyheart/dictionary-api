import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Dictionary } from 'src/dictionary/models/dictionary.model';
import { Languages } from 'src/translate/types';

@Table({ tableName: 'language' })
export class Language extends Model<Language> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'russian',
    description: 'Название языка',
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: Languages;

  @HasMany(() => Dictionary)
  dictionaries: Dictionary[];
}
