import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CardService } from '../card/card.service';

@Injectable()
export class PrivateCardGuard implements CanActivate {
    constructor(private cardService: CardService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const params = req.params;

        const check = this.cardService.checkPrivate(
            params.id || req.body.cardId,
            req.user.id,
        );

        return check;
    }
}
