import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './models/image.model';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image) private readonly imageRepository: typeof Image,
  ) {}

  async create(dto: CreateImageDto) {
    const image = await this.imageRepository.create(dto);
    return image;
  }

  async getImageByData(data: string) {
    const image = await this.imageRepository.findOne({
      where: { data },
    });
    return image;
  }

  async findOrCreate(data: string) {
    const [image, imageCreated] = await this.imageRepository.findOrCreate({
      where: { data },
      defaults: {
        data,
      },
    });

    return image;
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
