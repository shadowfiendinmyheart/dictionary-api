import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Dictionary } from './models/dictionary.model';
import { DictionaryService } from './dictionary.service';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { ActionDictionaryGuard } from 'src/guards/action-dictionary.guard';

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
  @ApiResponse({ status: 200, type: [Dictionary] })
  @Get('/all')
  getAll() {
    return this.dictionaryService.getAllByUserId();
  }

  @ApiOperation({ summary: 'Получить все публичные словари' })
  @ApiResponse({ status: 200, type: [Dictionary] })
  @Get('/public')
  getAllPublic() {
    return this.dictionaryService.getAllPublic();
  }

  @ApiOperation({ summary: 'Получить словарь пользователя' })
  @ApiResponse({ status: 200, type: Dictionary })
  @Get(':id')
  get(@Param('id') id: number) {
    return this.dictionaryService.getOneById(id);
  }

  @ApiOperation({ summary: 'Поменять private значение на противоположное' })
  @ApiResponse({ status: 204 })
  @Patch('/private/:id')
  @HttpCode(204)
  @UseGuards(ActionDictionaryGuard)
  changePrivate(@Param('id') id: number) {
    return this.dictionaryService.changePrivate(id);
  }
}
