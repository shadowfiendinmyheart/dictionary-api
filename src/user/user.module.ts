import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Dictionary } from 'src/dictionary/models/dictionary.model';
import { UserController } from './user.controller';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Dictionary]),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
})
export class UserModule {}
