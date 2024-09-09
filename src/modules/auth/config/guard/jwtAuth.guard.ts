import {ExecutionContext,Injectable,UnauthorizedException,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (err || !user) {
            console.log("error : Unauthorized"); 
            throw err || new UnauthorizedException();
        }
        console.log('User from JWT:', user); 
        return user;
    }
}
