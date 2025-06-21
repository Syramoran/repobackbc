import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    //comprueba que el usuario existe, esa es su contraseña y genera un token
    async login({ email, password, number }: LoginDto) {
        if (!email && !number) {
            throw new NotFoundException('Ingrese numero o email');
        }

        const user = email
            ? await this.userService.findOneByEmail(email)
            : await this.userService.findOneByNumber(number!);

        if (!user) {
            throw new NotFoundException('Usuario no existe');
        }

        const isPassValid = await bcryptjs.compare(password, user.password);
        if (!isPassValid) {
            throw new UnauthorizedException('Contraseña incorrecta')
        }

        const payload = {
            email: user.email
        }
        const token = await this.jwtService.signAsync(payload)
        return {token, email};
    }

    async register(dto: CreateUserDto) {
        const user = await this.userService.create(dto)
        return user
    }
}
