import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Фраза на иностранном языке')
@Controller('phrase')
export class PhraseController {}
