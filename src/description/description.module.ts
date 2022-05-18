import { Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Description } from './models/description.model';

@Module({
  controllers: [DescriptionController],
  providers: [DescriptionService],
  imports: [SequelizeModule.forFeature([Description])],
  exports: [DescriptionService],
})
export class DescriptionModule {}
