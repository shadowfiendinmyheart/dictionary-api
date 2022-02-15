import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Dictionary } from './dictionary.model';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';

@ApiTags('Словарь')
@UseGuards(JwtAuthGuard)
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
  @Get()
  getAll() {
    return this.dictionaryService.getAllDictionary();
  }
}
