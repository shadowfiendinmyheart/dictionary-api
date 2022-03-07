import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserUsernameDto extends PickType(CreateUserDto, [
  'username',
] as const) {}
