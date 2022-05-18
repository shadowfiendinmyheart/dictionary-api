import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { Description } from './models/description.model';

@Injectable()
export class DescriptionService {
  constructor(
    @InjectModel(Description)
    private readonly descriptionRepository: typeof Description,
  ) {}

  create(createDescriptionDto: CreateDescriptionDto) {
    return 'This action adds a new description';
  }

  async findOrCreate(text: string) {
    const [description, descriptionCreated] =
      await this.descriptionRepository.findOrCreate({
        where: { text },
        defaults: {
          text,
        },
      });

    console.log(`${text} was created at ${Date.now()}`);

    return description;
  }

  findAll() {
    return `This action returns all description`;
  }

  async findOne(id: number) {
    const description = await this.descriptionRepository.findOne({
      where: { id },
    });
    return description;
  }

  update(id: number, updateDescriptionDto: UpdateDescriptionDto) {
    return `This action updates a #${id} description`;
  }

  remove(id: number) {
    return `This action removes a #${id} description`;
  }
}
