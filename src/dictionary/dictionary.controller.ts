import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Dictionary } from './dictionary.model';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';

@ApiTags('Словарь')
@Controller('dictionary')
export class DictionaryController {
  constructor(private dictionaryService: DictionaryService) {}

  @ApiOperation({ summary: 'Создание cловаря' })
  @ApiResponse({ status: 200, type: Dictionary })
  @Post()
  create(@Body() dictionaryDto: CreateDictionaryDto) {
    return this.dictionaryService.createDictionary(dictionaryDto);
  }

  @ApiOperation({ summary: 'Получить все словари пользователя' })
  @ApiResponse({ status: 200, type: Dictionary })
  @Get(':id')
  getAll(@Param('id') id: number) {
    return this.dictionaryService.getDictionaries(id);
  }
}
