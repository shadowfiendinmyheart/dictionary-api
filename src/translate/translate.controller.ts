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
import { TranslateService } from './translate.service';
import { CreateTranslateDto } from './dto/create-translate.dto';
import { UpdateTranslateDto } from './dto/update-translate.dto';

@ApiTags('Перевод')
@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @ApiOperation({ summary: 'Создание перевода' })
  @Post()
  create(@Body() createTranslateDto: CreateTranslateDto) {
    return this.translateService.create(createTranslateDto);
  }

  @ApiOperation({ summary: 'Получение всех переводов' })
  @Get()
  findAll() {
    return this.translateService.findAll();
  }

  @ApiOperation({ summary: 'Получение перевода по id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translateService.findOne(+id);
  }

  @ApiOperation({ summary: 'Редактирование перевода' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranslateDto: UpdateTranslateDto,
  ) {
    return this.translateService.update(+id, updateTranslateDto);
  }

  @ApiOperation({ summary: 'Удаление перевода' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translateService.remove(+id);
  }
}
