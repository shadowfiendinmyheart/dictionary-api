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
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ActionDictionaryGuard } from '../guards/action-dictionary.guard';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardDto } from './dto/get-card.dto';
import { UpdateCardDto, UpdateNameCardDto } from './dto/update-card.dto';
import { Card } from './models/card.model';
import { PrivateCardGuard } from '../guards/private-card.guard';
import { PrivateDictionaryGuard } from '../guards/private-dictionary.guard';
import { GetPaginationCardDto } from './dto/get-pagination-card.dto';
import { CardCounterMode, PaginationQuery, RandomQuery } from './types';
import { ActionCardGuard } from 'src/guards/action-card.guard';

@ApiTags('Карточка')
@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private cardService: CardService) {}

  @ApiOperation({ summary: 'Создание карточки' })
  @ApiResponse({ status: 201, type: Card })
  @Post()
  @UseGuards(ActionDictionaryGuard)
  create(@Body() cardDto: CreateCardDto) {
    return this.cardService.create(cardDto);
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

  @ApiOperation({ summary: 'Поменять фразу карточки' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Patch('/phrase/:id')
  @UseGuards(ActionCardGuard)
  changePhrase(@Param('id') id: string, @Body() cardDto: UpdateNameCardDto) {
    return this.cardService.changePhrase(Number(id), cardDto.phrase);
  }

  @ApiOperation({ summary: 'Повысить counter карточки на 1' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Patch('/counter/:id')
  @UseGuards(ActionCardGuard)
  increaseCounter(@Param('id') id: string) {
    return this.cardService.increaseCounter(Number(id));
  }

  @ApiOperation({ summary: 'Удалить карточку' })
  @ApiResponse({ status: 204 })
  @Delete(':id')
  @UseGuards(ActionCardGuard)
  remove(@Param('id') id: string) {
    return this.cardService.deleteById(Number(id));
  }
}
