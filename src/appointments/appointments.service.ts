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
    console.log('dateUTC:', dateUTC)

    //DIA 
    const diaUTC = mapDayToEnum(dateUTC.getDay());
    console.log('dia utc:', diaUTC)

    // HORA DE TURNO LOCAL
    const horaLocal = dateUTC.toTimeString().split(' ')[0];
    console.log('hora local:', horaLocal)

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

      console.log('Hora inicio turno nuevo local:', horaLocal)
      console.log('Hora fin turno nuevo local:', horaLocalFin)

      console.log('Hora inicio turno existente:', ini)
      console.log('Hora fin turno existente:', finlocal)

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
      const { id, deletedAt, ...rest } = guardado;
      return rest;

    } catch (error) {
      console.error('Error al guardar el turno:', error);
      throw new InternalServerErrorException('No se pudo guardar el turno');
    }
  }


  // async findAll() {
  //   const turnos = await this.turnoRepo.find({ where: { deleted: false } });

  //   return turnos.map(({ deleted, id, ...rest }) => rest); // si bloques esta vacío devuelve []
  // }

  // async findOne(uuid: string): Promise<any> {
  //   const turno = await this.turnoRepo.findOne({
  //     where: { uuid, deleted: false },
  //     relations: ['servicio', 'user'], // incluir relaciones si querés mostrar datos del servicio o usuario
  //   });

  //   if (!turno) {
  //     throw new NotFoundException('Turno no encontrado');
  //   }

  //   const { id, deleted, ...rest } = turno;
  //   return rest;
  // }



  // async update(uuid: string, dto: UpdateAppointmentDto): Promise<any> {
  //   const turno = await this.turnoRepo.findOne({
  //     where: { uuid, deleted: false },
  //     relations: ['servicio'],
  //   });

  //   if (!turno) {
  //     throw new NotFoundException('Turno no encontrado');
  //   }

  //   // Solo si llega una nueva fecha
  //   if (dto.date) {
  //     const nuevaFecha: Date = new Date(dto.date);
  //     const fecha = new Date(dto.date.toISOString().split('T')[0]);
  //     const horaInicio = new Date(dto.date);
  //     const horaTurno = horaInicio.toTimeString().split(':').slice(0, 2).join(':');
  //     const week_d = fecha.getDay();

  //     // Validar feriado
  //     const feriado = await this.feriadoRepo.findOne({ where: { date: fecha, deleted: false } });
  //     if (feriado) {
  //       throw new BadRequestException('No se pueden agendar turnos en feriados');
  //     }

  //     // Validar disponibilidad
  //     const bloques = await this.dispoRepo.find({ where: { week_day: week_d, deleted: false } });
  //     const duracionTotal = turno.servicio.duration_min + 30;
  //     const horaFin = new Date(horaInicio);
  //     horaFin.setMinutes(horaInicio.getMinutes() + duracionTotal);

  //     const enBloque = bloques.some(b =>
  //       horaTurno >= b.start &&
  //       horaFin.toTimeString().split(':').slice(0, 2).join(':') <= b.finish
  //     );

  //     if (!enBloque) {
  //       throw new BadRequestException('El turno está fuera del horario disponible');
  //     }

  //     // Verificar solapamiento con otros turnos
  //     const turnos = await this.turnoRepo.find({
  //       where: { deleted: false },
  //       relations: ['servicio'],
  //     });

  //     const turnosMismoDia = turnos.filter(t =>
  //       t.uuid !== uuid &&
  //       t.date.toISOString().split('T')[0] === nuevaFecha.toISOString().split('T')[0]
  //     );

  //     const haySolapamiento = turnosMismoDia.some(t => {
  //       const ini = new Date(t.date);
  //       const fin = new Date(ini);
  //       fin.setMinutes(ini.getMinutes() + t.servicio.duration_min + 30);
  //       return horaInicio < fin && horaFin > ini;
  //     });

  //     if (haySolapamiento) {
  //       throw new BadRequestException('Ya existe un turno en ese horario');
  //     }

  //     turno.date = nuevaFecha;
  //   }

  //   // Actualizar estado si se envía
  //   if (dto.state) {
  //     turno.state = dto.state;
  //   }

  //   const actualizado = await this.turnoRepo.save(turno);
  //   const { id, deleted, ...rest } = actualizado;
  //   return rest;
  // }

  // async remove(uuid: string) {
  //   const turno = await this.turnoRepo.findOne({ where: { uuid, deleted: false } });
  //   if (!turno) {
  //     throw new NotFoundException('Turno no encontrado');
  //   }

  //   turno.deleted = true;

  //   await this.dispoRepo.save(turno);
  // }
}
