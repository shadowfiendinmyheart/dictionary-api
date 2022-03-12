import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ActionDictionaryGuard } from '../guards/action-dictionary.guard';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardDto } from './dto/get-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './models/card.model';
import { PrivateCardGuard } from '../guards/private-card.guard';
import { PrivateDictionaryGuard } from '../guards/private-dictionary.guard';
import { GetPaginationCardDto } from './dto/get-pagination-card.dto';
import { CardCounterMode, PaginationQuery, RandomQuery } from './types';

@ApiTags('Карточка')
@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private cardService: CardService) {}

  @ApiOperation({ summary: 'Создание карточки' })
  @ApiResponse({ status: 201, type: Card })
  @Post()
  @UseGuards(ActionDictionaryGuard)
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @ApiOperation({ summary: 'Получить все карточки из словаря по id (словаря)' })
  @ApiResponse({ status: 200, type: [GetCardDto] })
  @Get('/dictionary/:id')
  @UseGuards(PrivateDictionaryGuard)
  getAllByDictionary(@Param('id') id: string) {
    return this.cardService.getAllByDictionary(Number(id));
  }

  @ApiOperation({ summary: 'Получить страницу из словаря по id (словаря)' })
  @ApiResponse({ status: 200, type: GetPaginationCardDto })
  @Get('/dictionary/pagination/:id')
  @UseGuards(PrivateDictionaryGuard)
  getPaginationByDictionary(
    @Param('id') id: string,
    @Query() query: PaginationQuery,
  ) {
    return this.cardService.getPaginationByDictionary(
      Number(id),
      Number(query.page),
      Number(query.size),
    );
  }

  @ApiOperation({
    summary: 'Получить случайные карточки из словаря по id (словаря)',
  })
  @ApiResponse({ status: 200, type: [GetCardDto] })
  @Get('/dictionary/random/:id')
  @UseGuards(PrivateDictionaryGuard)
  getCounterByDictionary(@Param('id') id: string, @Query() query: RandomQuery) {
    return this.cardService.getCounterByDictionary(
      Number(id),
      Number(query.size),
      Number(query.counter),
      Number(query.mode),
    );
  }

  @ApiOperation({ summary: 'Получить все карточки пользователя' })
  @ApiResponse({ status: 200, type: [GetCardDto] })
  @Get()
  getAllByUserId() {
    return this.cardService.getAllByUserId();
  }

  @ApiOperation({ summary: 'Получить карточку по id' })
  @ApiResponse({ status: 200, type: GetCardDto })
  @Get(':id')
  @UseGuards(PrivateCardGuard)
  getOne(@Param('id') id: string) {
    return this.cardService.getOne(Number(id));
  }

  @ApiOperation({ summary: 'Редактировать карточку' })
  @ApiResponse({ status: 200, type: GetCardDto })
  @Patch(':id')
  @UseGuards(ActionDictionaryGuard)
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @ApiOperation({ summary: 'Удалить карточку' })
  @ApiResponse({ status: 204 })
  @Delete(':id')
  @UseGuards(ActionDictionaryGuard)
  remove(@Param('id') id: string) {
    return this.cardService.deleteById(Number(id));
  }
}
