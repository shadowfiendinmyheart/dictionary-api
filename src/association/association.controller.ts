import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssociationService } from './association.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';

@ApiTags('Ассоциация')
@Controller('association')
export class AssociationController {
  constructor(private readonly associationService: AssociationService) {}

  @ApiOperation({ summary: 'Создание ассоциации' })
  @Post()
  create(@Body() createAssociationDto: CreateAssociationDto) {
    return this.associationService.create(createAssociationDto);
  }

  @ApiOperation({ summary: 'Получение всех ассоциаций' })
  @Get()
  findAll() {
    return this.associationService.findAll();
  }

  @ApiOperation({ summary: 'Получение ассоциации по id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.associationService.findOne(+id);
  }

  @ApiOperation({ summary: 'Редактирование ассоциации' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ) {
    return this.associationService.update(+id, updateAssociationDto);
  }

  @ApiOperation({ summary: 'Удаление ассоциации' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.associationService.remove(+id);
  }
}
