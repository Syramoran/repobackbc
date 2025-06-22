import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Disponibility } from './entities/disponibilidad.entity';
import { Repository } from 'typeorm';
import { Days } from 'src/common/enum-days';

@Injectable()
export class DisponibilidadService {

  constructor(
    @InjectRepository(Disponibility) private readonly dispoRepo: Repository<Disponibility>
  ) { }

  async create(createDisponibilidadDto: CreateDisponibilidadDto) {
    const dto = createDisponibilidadDto
    const bloques = await this.dispoRepo.find({ where: { week_day: Number(dto.week_day) } });


    const haySolapamiento = bloques.some(b =>
      dto.start <= b.finish && dto.finish >= b.start
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

      const { deletedAt, ...rest } = guardado;
      return rest
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el bloque de disponibilidad');
    }
  }

  async findAll() {
    const bloques = await this.dispoRepo.find();

    return bloques.map(({ deletedAt, ...rest }) => rest); // si bloques esta vacío devuelve []
  }

  async findAllByDay(dto: CreateDisponibilidadDto) {
    const bloques = await this.dispoRepo.find({ where: { week_day: dto.week_day } });

    return bloques.map(({ deletedAt, ...rest }) => rest); // si bloques esta vacío devuelve []
  }

  // async verBloques(dto: CreateDisponibilidadDto) {
  //   const bloques = await this.dispoRepo.find();
  //   console.log("Valor de week_day para buscar:", dto.week_day); // ¡Agrega esto!
  //   const bloquesMismoDia = await this.dispoRepo.findBy({
  //     week_day: Number(dto.week_day),
  //   });
  //   console.log("bloques:", bloques)
  //   console.log("bloques mismo dia:", bloquesMismoDia)
  // }

  async softDelete(id: string): Promise<any> {
    // softDelete() actualiza la columna deletedAt
    const result = await this.dispoRepo.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SomeEntity with ID "${id}" not found.`);
    }
    return result;
  }
}
