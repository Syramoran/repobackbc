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

      const { deleted, ...rest } = guardado;
      return rest
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el feriado');
    }
  }

  async findAll(): Promise<any[]> {
    const feriados = await this.feriadoRepo.find({ where: { deleted: false } });
    if (feriados.length <= 0) {
      return [];
    }
    return feriados.map(({ deleted, ...rest }) => rest);
  }

  async findOne(id: number): Promise<any> {
    const feriado = await this.feriadoRepo.findOne({ where: { id, deleted: false } });
    if (!feriado) {
      throw new NotFoundException('Servicio no encontrado');
    }
    const { deleted, ...rest } = feriado;
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

    const { deleted, ...rest } = feriado;
    return rest;
  }

  async remove(id: number) {
    const feriado = await this.feriadoRepo.findOne({ where: { id } });
    if (!feriado) {
      throw new NotFoundException('Feriado no encontrado');
    }

    if (feriado.deleted) {
      throw new BadRequestException('El servicio ya está eliminado');
    }

    feriado.deleted = true;

    await this.feriadoRepo.save(feriado);
  }
}
