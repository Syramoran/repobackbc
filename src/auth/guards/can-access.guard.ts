import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class CanAccessUserGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // viene del AuthGuard
    const params = request.params;
    console.log(user)

  if (user?.rol === 'admin') return true;
  if (user?.uuid === params.uuid) return true;

    throw new ForbiddenException('No tiene permiso para ver este perfil');
  }
}

