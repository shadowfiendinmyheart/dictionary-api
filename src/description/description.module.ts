import { forwardRef, Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Description } from './models/description.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DescriptionController],
  providers: [DescriptionService],
  imports: [
    SequelizeModule.forFeature([Description]),
    forwardRef(() => AuthModule),
  ],
  exports: [DescriptionService],
})
export class DescriptionModule {}
