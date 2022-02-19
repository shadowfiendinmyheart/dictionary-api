import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { Association } from './entities/association.model';

@Injectable()
export class AssociationService {
  constructor(
    @InjectModel(Association) private associationRepository: typeof Association,
  ) {}

  async create(dto: CreateAssociationDto) {
    console.log('create', dto);
    const association = await this.associationRepository.create({
      translate_id: dto.translateId,
      image_id: dto.imageId,
    });
    return association;
  }

  async getAssociation(dto: CreateAssociationDto) {
    const association = await this.associationRepository.findOne({
      where: { translate_id: dto.translateId, image_id: dto.imageId },
    });
    return association;
  }

  findAll() {
    return `This action returns all association`;
  }

  findOne(id: number) {
    return `This action returns a #${id} association`;
  }

  update(id: number, updateAssociationDto: UpdateAssociationDto) {
    return `This action updates a #${id} association`;
  }

  remove(id: number) {
    return `This action removes a #${id} association`;
  }
}
