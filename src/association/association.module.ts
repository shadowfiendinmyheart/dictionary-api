import { Module } from '@nestjs/common';
import { AssociationService } from './association.service';
import { AssociationController } from './association.controller';

@Module({
  controllers: [AssociationController],
  providers: [AssociationService],
})
export class AssociationModule {}
