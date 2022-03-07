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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ActionCardGuard } from './action-card.guard';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardDto } from './dto/get-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './models/card.model';

@ApiTags('Карточка')
@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private cardService: CardService) {}

  @ApiOperation({ summary: 'Создание карточки' })
  @ApiResponse({ status: 201, type: Card })
  @Post()
  @UseGuards(ActionCardGuard)
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @ApiOperation({ summary: 'Получить все карточки из словаря по id (словаря)' })
  @ApiResponse({ status: 200, type: GetCardDto, isArray: true })
  @Get('/dictionary/:id')
  getAllByDictionary(@Param('id') id: string) {
    return this.cardService.getAllByDictionary(Number(id));
  }

  @ApiOperation({ summary: 'Получить все карточки пользователя' })
  @ApiResponse({ status: 200, type: GetCardDto, isArray: true })
  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @ApiOperation({ summary: 'Получить карточку по id' })
  @ApiResponse({ status: 200, type: GetCardDto })
  @Get(':id')
  @UseGuards(ActionCardGuard)
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @ApiOperation({ summary: 'Редактировать карточку' })
  @ApiResponse({ status: 200, type: GetCardDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @ApiOperation({ summary: 'Удалить карточку' })
  @ApiResponse({ status: 200, type: GetCardDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
