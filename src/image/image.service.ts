import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v2 as cloudinary } from 'cloudinary';
import { CreateImageFileDto } from './dto/create-image-file-dto';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './models/image.model';
import getImages from './utils';

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

  async getImagesFromOuterApi(text: string) {
    const imageResponse = await getImages(text);
    return imageResponse;
  }

  async createImageFile(dto: CreateImageFileDto) {
    if (!dto.publicId || !dto.url) {
      throw new HttpException('Недостаточно данных', HttpStatus.BAD_REQUEST);
    }

    // image optimization

    const result = await cloudinary.uploader.upload(dto.url, {
      public_id: dto.publicId,
    });
    return result;
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
