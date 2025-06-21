import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

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

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(){
        return 'profile';
    }
}
