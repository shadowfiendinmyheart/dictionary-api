import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { DictionaryService } from 'src/dictionary/dictionary.service';
  
  @Injectable()
  export class PrivateDictionaryGuard implements CanActivate {
    constructor(private dictionaryService: DictionaryService) {}
  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const req = context.switchToHttp().getRequest();
      const params = req.params;
  
      const check = this.dictionaryService.checkPrivate(
          params.id || req.body.dictionaryId,
          req.user.id,
      );
  
      return check;
    }
  }
  