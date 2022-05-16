import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { getImagesFromOuterApiQuery } from './types';
import { CreateImageFileDto } from './dto/create-image-file-dto';

@ApiTags('Изображение')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Получение изображений со стороннего api' })
  @Get('/outer/')
  getImagesFromOuterApi(@Query() query: getImagesFromOuterApiQuery) {
    return this.imageService.getImagesFromOuterApi(query.text);
  }

  @ApiOperation({ summary: 'Получение изображений со стороннего api' })
  @Post('/create/')
  createImage(@Body() createImageFileDto: CreateImageFileDto) {
    return this.imageService.createImageFile(createImageFileDto);
  }

  @ApiOperation({ summary: 'Создание изображения' })
  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @ApiOperation({ summary: 'Получение всех изображений' })
  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: 'Получение изображения по id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @ApiOperation({ summary: 'Редактирование изображения' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @ApiOperation({ summary: 'Удаление изображения' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
