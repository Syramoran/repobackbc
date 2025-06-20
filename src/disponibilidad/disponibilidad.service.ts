import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Disponibility } from './entities/disponibilidad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DisponibilidadService {

  constructor(
    @InjectRepository(Disponibility) private readonly dispoRepo: Repository<Disponibility>
  ) { }

  async create(createDisponibilidadDto: CreateDisponibilidadDto) {
    const dto = createDisponibilidadDto
    const bloques = await this.dispoRepo.find({ where: { deleted: false, week_day: dto.week_day } });

    const haySolapamiento = bloques.some(b =>
      dto.start < b.finish && dto.finish > b.start
    );
    //Revisá todos los bloques que ya existen ese día. Si al menos uno tiene un horario que se cruza con el nuevo bloque que querés crear, entonces hay solapamiento.
    //El inicio del nuevo bloque (dto.start) es antes del final de uno existente (b.finish), y
    //El final del nuevo bloque (dto.finish) es despues del inicio de uno existente (b.start)
    if (haySolapamiento) {
      throw new BadRequestException('El nuevo bloque se superpone con otro existente');
    }

    try {
      const bloque = this.dispoRepo.create(createDisponibilidadDto)
      const guardado = await this.dispoRepo.save(bloque)

      const { deleted, ...rest } = guardado;
      return rest
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el bloque de disponibilidad');
    }
  }

  async findAll() {
    const bloques = await this.dispoRepo.find({ where: { deleted: false } });

    return bloques.map(({ deleted, ...rest }) => rest); // si bloques esta vacío devuelve []
  }

  async findAllByDay(dto: CreateDisponibilidadDto) {
    const bloques = await this.dispoRepo.find({ where: { deleted: false, week_day: dto.week_day } });

    return bloques.map(({ deleted, ...rest }) => rest); // si bloques esta vacío devuelve []
  }

  async remove(id: number) {
    const bloque = await this.dispoRepo.findOne({ where: { id , deleted:false} });
    if (!bloque) {
      throw new NotFoundException('Bloque disponible no encontrado');
    }

    bloque.deleted = true;

    await this.dispoRepo.save(bloque);
    return 'Bloque de tiempo disponible eliminado correctamente'
  }
}
