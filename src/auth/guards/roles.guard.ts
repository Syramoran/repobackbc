import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../dto/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector:Reflector){}

  canActivate(context: ExecutionContext,): boolean {

    const rol = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if(!rol){
      return true
    }

    const {user} = context.switchToHttp().getRequest()

    return user.rol === rol;
  }
}
