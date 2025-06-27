import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { Feriado } from 'src/feriados/entities/feriado.entity';
import { Disponibility } from 'src/disponibilidad/entities/disponibilidad.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { User } from 'src/users/entities/user.entity';
import { calcularFechaBase } from 'src/common/fecha-local';
import { mapDayToEnum } from 'src/common/map-days';

@Injectable()
export class AppointmentsService {

  constructor(
    @InjectRepository(Appointment) private readonly turnoRepo: Repository<Appointment>,
    @InjectRepository(Feriado) private readonly feriadoRepo: Repository<Feriado>,
    @InjectRepository(Disponibility) private readonly dispoRepo: Repository<Disponibility>,
    @InjectRepository(Servicio) private readonly servicioRepo: Repository<Servicio>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,

  ) { }


  async create(dto: CreateAppointmentDto): Promise<any> {
    //HORA GLOBAL DEL DTO
    const dateUTC = dto.date

    //DIA 
    const diaUTC = mapDayToEnum(dateUTC.getDay());



    // HORA DE TURNO LOCAL
    // const horaLocal = dateUTC.toTimeString().split(' ')[0];
    const horaLocal = new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Argentina/Buenos_Aires'
    }).format(dateUTC);


    //SERVICIO
    const servicio = await this.servicioRepo.findOne({ where: { uuid: dto.servicio_uuid } });
    if (!servicio) {
      throw new NotFoundException('Servicio invalido');
    }
    const duracionServicio = servicio.duration_min + 30;

    // CALCULAR HORA FINAL TURNO LOCAL
    const [h, m, s] = horaLocal.split(':').map(Number);
    const finDate = new Date();
    finDate.setHours(h, m + duracionServicio, s); // suma duracion del servicio
    const horaLocalFin = finDate.toTimeString().split(' ')[0]; // "HH:MM:SS"
    ;
    //Verificar si es feriado
    const soloFecha = dateUTC.toISOString().split('T')[0];
    const feriado = await this.feriadoRepo.findOne({ where: { date: soloFecha } });
    if (feriado) {
      throw new BadRequestException('No se pueden agendar turnos en feriados');
    }

    //bloques
    const bloques = await this.dispoRepo.find({ where: { week_day: diaUTC } });
    const enBloque = bloques.some(b => { return horaLocal >= b.start && horaLocalFin <= b.finish; })

    if (!enBloque) { throw new NotFoundException('No hay bloque disponible') }


    //VALIDAR: solapamiento
    const turnos = await this.turnoRepo.find({ relations: ['servicio'] })
    const turnosMismoDia = turnos.filter(t => {
      const turnoExistente = t.date.toISOString().split('T')[0];
      return dto.date.toISOString().split('T')[0] === turnoExistente;
    });

    const haySolapamiento = turnosMismoDia.some(t => {
      const ini = t.date.toTimeString().split(' ')[0];
      const fin = new Date(t.date);
      fin.setMinutes(t.date.getMinutes() + t.servicio.duration_min + 30)
      const finlocal = fin.toTimeString().split(' ')[0];

      // console.log('Hora inicio turno nuevo local:', horaLocal)
      // console.log('Hora fin turno nuevo local:', horaLocalFin)

      // console.log('Hora inicio turno existente:', ini)
      // console.log('Hora fin turno existente:', finlocal)

      return horaLocal <= finlocal && horaLocalFin > ini
    })

    if (haySolapamiento) {
      throw new BadRequestException('Hay solapamientooou')
    }

    try {
      const usuario = await this.userRepo.findOne({ where: { uuid: dto.user_uuid } });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado')
      }

      const nuevoTurno = this.turnoRepo.create({
        ...dto,
        user: usuario,
        servicio: servicio,
        date: dto.date
      });

      const guardado = await this.turnoRepo.save(nuevoTurno);
      const { id, deletedAt, user, servicio: servicioGuardado, ...rest } = guardado;
      return {
        ...rest,
        user: { uuid: user.uuid, name: user.name },
        servicio: { name: servicioGuardado.name }
      };

    } catch (error) {
      console.error('Error al guardar el turno:', error);
      throw new InternalServerErrorException('No se pudo guardar el turno');
    }
  }

  async update(uuid: string, dto: UpdateAppointmentDto): Promise<any> {
    const turno = await this.turnoRepo.findOne({
      where: { uuid },
      relations: ['servicio'],
    });

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    // Solo si llega una nueva fecha
    if (dto.date) {
      const dateUTC = dto.date;
      console.log('dateUTC:', dateUTC);

      //Verificar si es feriado
      const soloFecha = dateUTC.toISOString().split('T')[0];
      const feriado = await this.feriadoRepo.findOne({ where: { date: soloFecha } });
      if (feriado) {
        throw new BadRequestException('No se pueden agendar turnos en feriados');
      }

      const diaUTC = mapDayToEnum(dateUTC.getDay());
      console.log('dia utc:', diaUTC);

      // HORA DE TURNO LOCAL
      // const horaLocal = dateUTC.toTimeString().split(' ')[0];
      const horaLocal = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires'
      }).format(dateUTC);

      const servicio = turno.servicio;
      const duracionServicio = servicio.duration_min + 30;

      const [h, m, s] = horaLocal.split(':').map(Number);
      const finDate = new Date();
      finDate.setHours(h, m + duracionServicio, s);
      const horaLocalFin = finDate.toTimeString().split(' ')[0];

      const bloques = await this.dispoRepo.find({ where: { week_day: diaUTC } });
      const enBloque = bloques.some(b => horaLocal >= b.start && horaLocalFin <= b.finish);

      if (!enBloque) {
        throw new NotFoundException('No hay bloque disponible');
      }

      const turnos = await this.turnoRepo.find({ relations: ['servicio'] });
      const turnosMismoDia = turnos.filter(t => {
        const turnoExistente = t.date.toISOString().split('T')[0];
        return turno.date.toISOString().split('T')[0] === turnoExistente && t.uuid !== uuid;
      });

      const haySolapamiento = turnosMismoDia.some(t => {
        const ini = t.date.toTimeString().split(' ')[0];
        const fin = new Date(t.date);
        fin.setMinutes(t.date.getMinutes() + t.servicio.duration_min + 30);
        const finlocal = fin.toTimeString().split(' ')[0];

        console.log('Hora inicio turno nuevo local:', horaLocal);
        console.log('Hora fin turno nuevo local:', horaLocalFin);

        console.log('Hora inicio turno existente:', ini);
        console.log('Hora fin turno existente:', finlocal);

        return horaLocal <= finlocal && horaLocalFin > ini;
      });

      if (haySolapamiento) {
        throw new BadRequestException('Hay solapamientooou');
      }

      turno.date = dto.date;
    }

    if (dto.state) {
      turno.state = dto.state;
    }

    const actualizado = await this.turnoRepo.save(turno);
    const { id, deletedAt, ...rest } = actualizado;
    return rest;
  }


  async findAll() {
    const turnos = await this.turnoRepo.find();

    return turnos.map(({ deletedAt, id, ...rest }) => rest); // si bloques esta vacío devuelve []
  }

  async findOne(uuid: string): Promise<any> {
    const turno = await this.turnoRepo.findOne({
      where: { uuid },
      relations: ['servicio', 'user'], // incluir relaciones si querés mostrar datos del servicio o usuario
    });

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    const { id, deletedAt, ...rest } = turno;
    return rest;
  }



  async softDelete(uuid: string): Promise<any> {
    // softDelete() actualiza la columna deletedAt
    const turno = await this.turnoRepo.findOne({ where: { uuid } })
    if (!turno) {
      throw new NotFoundException('servicio no hallado')
    }
    const result = await this.turnoRepo.softDelete(turno?.id);
    if (result.affected === 0) {
      throw new NotFoundException(`Turno con ID "${uuid}" no encontrado.`);
    }
    return result;
  }
}
