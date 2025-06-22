import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { Repository } from 'typeorm';

//FALTA HACER UNA INTERFAZ DE RESPUESTAS

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio) private readonly servicioRepo: Repository<Servicio>
  ) { }

  async create(createServicioDto: CreateServicioDto): Promise<CreateServicioDto> {
    try {
      const servicio = this.servicioRepo.create(createServicioDto)
      const guardado = await this.servicioRepo.save(servicio)

      const { deletedAt, id, ...rest } = guardado;
      return rest
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el servicio');
    }
  }

  // async findAll(): Promise<any[]> {
  //   const servicios = await this.servicioRepo.find({ where: { deleted: false } });
  //   return servicios.map(({ deleted, id, ...rest }) => rest);
  // }

  // async findOne(uuid: string): Promise<any> {
  //   const servicio = await this.servicioRepo.findOne({ where: { uuid, deleted: false } });
  //   if (!servicio) {
  //     throw new NotFoundException('Servicio no encontrado');
  //   }
  //   const { deleted, id, ...rest } = servicio;
  //   return rest;
  // }

  // async update(uuid: string, updateServicioDto: UpdateServicioDto) {
  //   const servicio = await this.servicioRepo.findOne({ where: { uuid, deleted : false } });
  //   if (!servicio) {
  //     throw new NotFoundException('Servicio no encontrado');
  //   }

  //   await this.servicioRepo.update(servicio.id, updateServicioDto);
  //   const actualizado = await this.servicioRepo.findOne({ where: { id: servicio.id } });

  //   if (!actualizado) {
  //     throw new NotFoundException('Servicio actualizado no encontrado');
  //   }

  //   const { id, deleted, ...rest } = actualizado;
  //   return rest;
  // }

   async softDelete(uuid: string): Promise<any> {
    // softDelete() actualiza la columna deletedAt
    const result = await this.servicioRepo.softDelete(uuid);
    if (result.affected === 0) {
      throw new NotFoundException(`SomeEntity with ID "${uuid}" not found.`);
    }
    return result;
  }
}
