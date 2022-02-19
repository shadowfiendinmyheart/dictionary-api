import { Module } from '@nestjs/common';
import { AssociationService } from './association.service';
import { AssociationController } from './association.controller';
import { Association } from './entities/association.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [AssociationController],
  providers: [AssociationService],
  imports: [SequelizeModule.forFeature([Association])],
  exports: [AssociationService],
})
export class AssociationModule {}
