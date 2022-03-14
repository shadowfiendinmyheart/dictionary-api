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
import {
  UpdateAssociationsCardDto,
  UpdateDescriptionAssociationDto,
  UpdateDescriptionCardDto,
  UpdatePhraseCardDto,
} from './dto/update-card.dto';
import { Card } from './models/card.model';
import { PrivateCardGuard } from '../guards/private-card.guard';
import { PrivateDictionaryGuard } from '../guards/private-dictionary.guard';
import { GetPaginationCardDto } from './dto/get-pagination-card.dto';
import { DeleteAssociationQuery, PaginationQuery, RandomQuery } from './types';
import { ActionCardGuard } from 'src/guards/action-card.guard';
import { CardAssociation } from './models/cardAssociation.model';
import { ActionCardAssociationGuard } from 'src/guards/action-card-association.guard';

@ApiTags('Карточка')
@Controller('card')
@UseGuards(JwtAuthGuard)
export class CardController {
  constructor(private cardService: CardService) {}

  @ApiOperation({ summary: 'Создание карточки' })
  @ApiResponse({ status: 201, type: Card })
  @UseGuards(ActionDictionaryGuard)
  @Post()
  create(@Body() cardDto: CreateCardDto) {
    return this.cardService.create(cardDto);
  }

  @ApiOperation({ summary: 'Получить все карточки из словаря по id (словаря)' })
  @ApiResponse({ status: 200, type: [GetCardDto] })
  @UseGuards(PrivateDictionaryGuard)
  @Get('/dictionary/:id')
  getAllByDictionary(@Param('id') id: string) {
    return this.cardService.getAllByDictionary(Number(id));
  }

  @ApiOperation({ summary: 'Получить страницу из словаря по id (словаря)' })
  @ApiResponse({ status: 200, type: GetPaginationCardDto })
  @UseGuards(PrivateDictionaryGuard)
  @Get('/dictionary/pagination/:id')
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
  @UseGuards(PrivateDictionaryGuard)
  @Get('/dictionary/random/:id')
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
  @UseGuards(PrivateCardGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.cardService.getOne(Number(id));
  }

  @ApiOperation({ summary: 'Поменять фразу карточки' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @UseGuards(ActionCardGuard)
  @Patch('/phrase/:id')
  changePhrase(@Param('id') id: string, @Body() cardDto: UpdatePhraseCardDto) {
    return this.cardService.changePhrase(Number(id), cardDto.phrase);
  }

  @ApiOperation({ summary: 'Поменять описание карточки' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @UseGuards(ActionCardGuard)
  @Patch('/description/:id')
  changeDescription(
    @Param('id') id: string,
    @Body() cardDto: UpdateDescriptionCardDto,
  ) {
    return this.cardService.changeDescription(Number(id), cardDto.description);
  }

  @ApiOperation({ summary: 'Повысить counter карточки на 1' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @UseGuards(ActionCardGuard)
  @Patch('/counter/:id')
  increaseCounter(@Param('id') id: string) {
    return this.cardService.increaseCounter(Number(id));
  }

  @ApiOperation({ summary: 'Удалить карточку' })
  @ApiResponse({ status: 204 })
  @UseGuards(ActionCardGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cardService.deleteById(Number(id));
  }

  @ApiOperation({ summary: 'Добавление ассоциации в карточку' })
  @ApiResponse({ status: 201, type: CardAssociation })
  @UseGuards(ActionCardGuard)
  @Post('/association/:id')
  addAssociation(
    @Param('id') id: string,
    @Body() cardDto: UpdateAssociationsCardDto,
  ) {
    return this.cardService.addAssociation(Number(id), cardDto);
  }

  @ApiOperation({ summary: 'Поменять описание ассоциации' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @UseGuards(ActionCardAssociationGuard)
  @Patch('/associationdescription/:id')
  changeCardAssociationDescription(
    @Param('id') id: string,
    @Body() cardDto: UpdateDescriptionAssociationDto,
  ) {
    return this.cardService.changeAssociationDescription(
      Number(id),
      cardDto.description,
    );
  }

  @ApiOperation({ summary: 'Удалить ассоциацию в карточке' })
  @ApiResponse({ status: 204 })
  @UseGuards(ActionCardGuard)
  @Delete('/association/:id')
  deleteAssociation(
    @Param('id') cardId: string,
    @Query() query: DeleteAssociationQuery,
  ) {
    return this.cardService.deleteAssociation(
      Number(cardId),
      Number(query.association),
    );
  }
}
