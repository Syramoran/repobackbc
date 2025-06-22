import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "../dto/roles.enum";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export function Auth(rol:Role){
    return applyDecorators(
        Roles(rol),
        UseGuards(AuthGuard, RolesGuard)
    )
}