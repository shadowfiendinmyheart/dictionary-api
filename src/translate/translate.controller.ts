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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TranslateService } from './translate.service';
import {
  CreateTranslateDto,
  GetTranslatePhraseDto,
} from './dto/create-translate.dto';
import { UpdateTranslateDto } from './dto/update-translate.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Перевод')
@UseGuards(JwtAuthGuard)
@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @ApiOperation({
    summary: 'Получить перевод (+ примеры) фразы со стороннего ресурса',
  })
  @Get('/phrase')
  // почему он не триггерится
  translatePhrase(@Body() translateDto: GetTranslatePhraseDto) {
    return this.translateService.translatePhrase(translateDto);
  }

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
