import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/interfaz-resp';
import { normalizarTelefono } from 'src/common/normalizar-telf';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Appointment) private readonly turnoRepo: Repository<Appointment>,
  ) { }

  // CREAR USUARIO 
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {

    // Si llega un email, comprobar que no esté registrado
    if (createUserDto.email) {
      const emailExists = await this.userRepo.findOne({ where: { email: createUserDto.email } });
      if (emailExists) {
        throw new BadRequestException('El usuario ya existe');
      }
    }

    // comprueba que el numero no esté registrado
    const numeroNormalizado = normalizarTelefono(createUserDto.number)
    const numberExists = await this.userRepo.findOne({ where: { number: numeroNormalizado } });
    if (numberExists) {
      throw new BadRequestException('El usuario ya existe')
    }

    //encripta contraseña
    const hashedpass = await bcrypt.hash(createUserDto.password, 10);
    const dto = { ...createUserDto, password: hashedpass };

    //normalizar telefono
    dto.number = numeroNormalizado

    // crea el usuario con repository
    try {
      const user = this.userRepo.create(dto);
      const guardado = await this.userRepo.save(user);

      const { password, id, deletedAt, ...rest } = guardado;
      return rest as UserResponseDto;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('No se pudo crear el usuario');
    }



  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map(({ deletedAt, password, id, ...rest }) => rest as UserResponseDto);
    // Para cada usuario, devolvemos todos sus datos excepto la contraseña y el ID interno, y armamos una nueva lista solo con esos datos seguros.
  }

  async findOne(uuid: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { uuid } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { deletedAt, password, id, ...rest } = user;
    return rest as UserResponseDto;
  }

  async findOneByEmail(email: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email} });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { deletedAt, id, ...rest } = user;
    return rest;
  }

  async findOneByNumber(num: string): Promise<any> {
    const number = normalizarTelefono(num)
    const user = await this.userRepo.findOne({ where: { number} });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { deletedAt, id, ...rest } = user;
    return rest;
  }

  async findAllAppointments(uuid: string) {
    const user = await this.userRepo.findOne({ where: { uuid} });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const turnos = await this.turnoRepo.find({
      where: { user},
      relations: ['servicio'],
      order: { date: 'ASC' },
    });

    return turnos.map(({ id, deletedAt, ...rest }) => rest);
  }

  async update(uuid: string, updateDto: UpdateUserDto): Promise<UserResponseDto> {

    // buscar usuario a actualizar
    const user = await this.userRepo.findOne({ where: { uuid } })
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
    const updatedUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (!updatedUser) {
      throw new InternalServerErrorException('Usuario eliminado');
    }

    const { deletedAt, password, id, ...rest } = updatedUser;
    return rest as UserResponseDto;
  }

   async softDelete(uuid: string): Promise<any> {
    // softDelete() actualiza la columna deletedAt
    const user = await this.userRepo.findOne({where: {uuid}})
    if (!user){
      throw new NotFoundException('usuario no hallado')
    }
    const result = await this.userRepo.softDelete(user?.id);
    if (result.affected === 0) {
      throw new NotFoundException(`SomeEntity with ID "${uuid}" not found.`);
    }
    return result;
  }
}
