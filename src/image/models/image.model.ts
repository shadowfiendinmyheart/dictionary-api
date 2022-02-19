import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Association } from 'src/card/models/association.model';

@Table({ tableName: 'image' })
export class Image extends Model<Image> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'some base64',
    description: 'Картинка',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  data: string;

  @HasMany(() => Association)
  associations: Association[];
}
