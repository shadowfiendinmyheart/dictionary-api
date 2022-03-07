import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DictionaryService } from 'src/dictionary/dictionary.service';

@Injectable()
export class ActionCardGuard implements CanActivate {
  constructor(private dictionaryService: DictionaryService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const params = req.params;

    const check = this.dictionaryService.checkByUserId(
      req.user.id,
      params.id || req.body.dictionaryId,
    );

    return check;
  }
}
