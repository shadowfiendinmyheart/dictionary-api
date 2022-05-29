import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DescriptionService } from './description.service';
import { CreateDescriptionDto } from './dto/create-description.dto';
import { UpdateDescriptionDto } from './dto/update-description.dto';
import { Description } from './models/description.model';

@ApiTags('Описание')
@UseGuards(JwtAuthGuard)
@Controller('description')
export class DescriptionController {
  constructor(private readonly descriptionService: DescriptionService) {}

  @ApiOperation({ summary: 'Создание описания' })
  @ApiResponse({ status: 200, type: Description })
  @Post()
  create(@Body() createDescriptionDto: CreateDescriptionDto) {
    return this.descriptionService.create(createDescriptionDto);
  }

  @Get()
  findAll() {
    return this.descriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.descriptionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDescriptionDto: UpdateDescriptionDto,
  ) {
    return this.descriptionService.update(+id, updateDescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.descriptionService.remove(+id);
  }
}
