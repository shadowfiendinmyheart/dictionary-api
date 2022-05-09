import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/models/user.model';

export class GetAuthDto extends PickType(User, ['token'] as const) {}
export class MakeAuthDto extends PickType(User, [
  'username',
  'password',
] as const) {}
