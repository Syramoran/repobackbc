import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Role } from './dto/roles.enum';
import { Auth } from './decorators/auth.decorator';

interface RequestWithUser extends Request{
    user: {
        email: string;
        admin: boolean;
    }
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('login')
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }

    
    @Post('register')
    register(@Body() createDtoUser: CreateUserDto){
        return this.authService.register(createDtoUser)
    }

    // @Get('profile')
    // @Roles(Role.USER)
    // @UseGuards(AuthGuard, RolesGuard)
    // profile(@Req()req: RequestWithUser){
    //     return req.user;
    // }

    // @Get('profile')
    // @Auth(Role.ADMIN)
    // profile(@Req()req: RequestWithUser){
    //     return req.user;
    // }
}
