import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feriado } from './entities/feriado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeriadosService {
  constructor(
    @InjectRepository(Feriado) private readonly feriadoRepo: Repository<Feriado>
  ) { }

  async create(createFeriadoDto: CreateFeriadoDto) {
    try {
      const feriado = this.feriadoRepo.create(createFeriadoDto)
      const guardado = await this.feriadoRepo.save(feriado)

      const { deletedAt, ...rest } = guardado;
      return rest
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el feriado');
    }
  }

  async findAll(): Promise<any[]> {
    const feriados = await this.feriadoRepo.find();
    return feriados.map(({ deletedAt, ...rest }) => rest);
  }

  async findOne(id: number): Promise<any> {
    const feriado = await this.feriadoRepo.findOne({where:{id}});
    if (!feriado) {
      throw new NotFoundException('Feriado no encontrado');
    }
    const { deletedAt, ...rest } = feriado;
    return rest;
  }

  async update(id: number, updateFeriadoDto: UpdateFeriadoDto) {
    const feriado = await this.feriadoRepo.findOne({ where: { id } });
    if (!feriado) {
      throw new NotFoundException('Feriado no encontrado');
    }

    await this.feriadoRepo.update(feriado.id, updateFeriadoDto);
    const actualizado = await this.feriadoRepo.findOne({ where: { id: feriado.id } });
    if (!actualizado) {
      throw new NotFoundException('Feriado actualizado no encontrado');
    }

    const { deletedAt, ...rest } = feriado;
    return rest;
  }

   async softDelete(id: number): Promise<any> {
    // softDelete() actualiza la columna deletedAt
    const result = await this.feriadoRepo.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Feriado con ID "${id}" no fue encontrado.`);
    }
    return result;
  }
}
