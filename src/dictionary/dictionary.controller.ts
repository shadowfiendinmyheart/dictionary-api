import {
  Body,
  Controller,
  Delete,
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
import { UpdateNameDictionaryDto } from './dto/update-name-dictionary.dto';
import { PrivateDictionaryGuard } from 'src/guards/private-dictionary.guard';

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
  @Get()
  getAll() {
    return this.dictionaryService.getAllByUserId();
  }

  @ApiOperation({ summary: 'Получить все публичные словари' })
  @ApiResponse({ status: 200, type: [Dictionary] })
  @Get('/public')
  getAllPublic() {
    return this.dictionaryService.getAllPublic();
  }

  @ApiOperation({ summary: 'Получить все публичные словари пользователя' })
  @ApiResponse({ status: 200, type: [Dictionary] })
  @Get('/public/:id')
  getAllPublicByUserId(@Param('id') id: number) {
    return this.dictionaryService.getAllPublicByUserId(id);
  }

  @ApiOperation({ summary: 'Получить словарь пользователя' })
  @ApiResponse({ status: 200, type: Dictionary })
  @Get(':id')
  @UseGuards(PrivateDictionaryGuard)
  get(@Param('id') id: number) {
    return this.dictionaryService.getOneById(id);
  }

  @ApiOperation({
    summary: 'Поменять private значение словаря на противоположное',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @UseGuards(ActionDictionaryGuard)
  @Patch('/private/:id')
  changePrivate(@Param('id') id: number) {
    return this.dictionaryService.changePrivate(id);
  }

  @ApiOperation({ summary: 'Поменять название словаря' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @UseGuards(ActionDictionaryGuard)
  @Patch('/name/:id')
  changeName(
    @Param('id') id: number,
    @Body() dictionaryDto: UpdateNameDictionaryDto,
  ) {
    return this.dictionaryService.changeName(id, dictionaryDto.name);
  }

  @ApiOperation({ summary: 'Удалить словарь' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @UseGuards(ActionDictionaryGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.dictionaryService.deleteById(id);
  }
}
