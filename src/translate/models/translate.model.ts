import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Association } from 'src/association/entities/association.model';

@Table({ tableName: 'translate' })
export class Translate extends Model<Translate> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Кот',
    description: 'Перевод фразы или слова с иностранного языка',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => Association)
  associations: Association[];
}
