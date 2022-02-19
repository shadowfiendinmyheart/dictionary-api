import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './models/image.model';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [SequelizeModule.forFeature([Image])],
  exports: [ImageService],
})
export class ImageModule {}
