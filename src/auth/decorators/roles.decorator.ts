import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'
export const Roles = (rol: string) => SetMetadata(ROLES_KEY, rol);