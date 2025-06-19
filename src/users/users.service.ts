import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/interfaz-resp';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }

  // CREAR USUARIO 
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {

    // Si llega un email, comprobar que no esté registrado
    if (createUserDto.email) {
      const emailExists = await this.userRepo.findOne({ where: { email: createUserDto.email } });
      if (emailExists) {
        throw new BadRequestException('El email ya está en uso');
      }
    }

    // comprueba que el numero no esté registrado
    const numberExists = await this.userRepo.findOne({ where: { number: createUserDto.number } });
    if (numberExists) {
      throw new BadRequestException('El número de teléfono ya corresponde a un usuario')
    }

    //encripta contraseña
    const hashedpass = await bcrypt.hash(createUserDto.password, 10);
    const dto = { ...createUserDto, password: hashedpass };
    // crea el usuario con repository
    try {
      const user = this.userRepo.create(dto);
      const guardado = await this.userRepo.save(user);

      const { password, id, ...rest } = guardado;
      return rest as UserResponseDto;

    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el usuario');
    }



  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find({ where: { deleted: false } });
    if (users.length <= 0) {
      return [];
    }
    return users.map(({ password, id, ...rest }) => rest as UserResponseDto);
    // Para cada usuario, devolvemos todos sus datos excepto la contraseña y el ID interno, y armamos una nueva lista solo con esos datos seguros.
  }

  async findOne(uuid: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { uuid , deleted: false} });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { password, id, ...rest } = user;
    return rest as UserResponseDto;
  }

  //ACTUALIZAR
  async update(uuid: string, updateDto: UpdateUserDto): Promise<UserResponseDto> {

    // buscar usuario a actualizar
    const user = await this.userRepo.findOne({ where: { uuid , deleted : false} })
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // hashea la nueva contraseña si se editó
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    //actualizar
    await this.userRepo.update(user.id, updateDto);

    //buscar usuario actualizado para devolverlo
    const updatedUser = await this.userRepo.findOne({ where: { id: user.id, deleted : false } });
    if (!updatedUser) {
      throw new InternalServerErrorException('Usuario eliminado');
    }

    const { password, id, ...rest } = updatedUser;
    return rest as UserResponseDto;
  }

  async remove(uuid: string) {
    const user = await this.userRepo.findOne({ where: { uuid } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.deleted) {
      throw new BadRequestException('El usuario ya está eliminado');
    }

    user.deleted = true;

    await this.userRepo.save(user);

  }
}
