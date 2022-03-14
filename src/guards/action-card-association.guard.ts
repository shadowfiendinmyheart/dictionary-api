import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CardService } from 'src/card/card.service';

@Injectable()
export class ActionCardAssociationGuard implements CanActivate {
  constructor(private cardService: CardService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const params = req.params;

    const check = this.cardService.checkCardAssociationByUserId(
      req.user.id,
      params.id || req.body.cardAssociationId,
    );

    return check;
  }
}
