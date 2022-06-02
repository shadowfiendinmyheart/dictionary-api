import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  HasMany,
  IsEmail,
  Length,
  Model,
  Table,
} from 'sequelize-typescript';
import { Dictionary } from 'src/dictionary/models/dictionary.model';

interface UserCreationAttrs {
  username: string;
  email: string;
  password: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'user@mail.com', description: 'Почта пользователя' })
  @IsEmail
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @Length({ min: 8, max: 128 })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 'coolguy', description: 'Никнейм пользователя' })
  @Length({ min: 3, max: 25 })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  username: string;

  @HasMany(() => Dictionary)
  dictionaries: Dictionary[];
}
