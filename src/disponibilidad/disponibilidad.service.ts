import { Injectable } from '@nestjs/common';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';

@Injectable()
export class DisponibilidadService {
  create(createDisponibilidadDto: CreateDisponibilidadDto) {
    return 'This action adds a new disponibilidad';
  }

  findAll() {
    return `This action returns all disponibilidad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} disponibilidad`;
  }

  update(id: number, updateDisponibilidadDto: UpdateDisponibilidadDto) {
    return `This action updates a #${id} disponibilidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} disponibilidad`;
  }
}
