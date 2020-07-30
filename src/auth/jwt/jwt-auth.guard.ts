import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private readonly reflector: Reflector) {
        super();
    }
    
    async canActivate(context: ExecutionContext) {
      const isPublic = this.reflector.get<boolean>('public', context.getHandler());
      if (isPublic) {
        return true;
      }
  
      const isAuthenticated = await super.canActivate(context);
      console.log('isAuthenticated', isAuthenticated)

      if (!isAuthenticated) {
        return false;
      }

      return true;
    }
}
