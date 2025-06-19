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
    const fecha = new Date(dto.date.toISOString().split('T')[0]); // 'YYYY-MM-DD'
    const horaInicio = new Date(dto.date);
    const horaTurno = horaInicio.toTimeString().split(':').slice(0, 2).join(':'); // "HH:mm"
    const week_d = fecha.getDay(); // 0-6

    // 1. Verificar si es feriado
    const feriado = await this.feriadoRepo.findOne({ where: { date: fecha, deleted: false } });
    if (feriado) {
      throw new BadRequestException('No se pueden agendar turnos en feriados');
    }

    // 2. Verificar bloques disponibles ese día
    const bloques = await this.dispoRepo.find({ where: { week_day: week_d, deleted: false } });

    const servicio = await this.servicioRepo.findOne({ where: { uuid: dto.servicio_uuid, deleted: false } });
    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const duracionTotal = servicio.duration_min + 30;
    const horaFin = new Date(horaInicio);
    horaFin.setMinutes(horaInicio.getMinutes() + duracionTotal);

    const enBloque = bloques.some(b =>
      horaTurno >= b.start && horaFin.toTimeString().split(':').slice(0, 2).join(':') <= b.finish
    );

    if (!enBloque) {
      throw new BadRequestException('El turno está fuera del horario disponible');
    }

    // 3. Verificar que no se superponga con otros turnos
    const turnos = await this.turnoRepo.find({ where: { deleted: false } });
    const turnosMismoDia = turnos.filter(t =>
      t.date.toISOString().split('T')[0] === dto.date.toISOString().split('T')[0]
    );

    const haySolapamiento = turnosMismoDia.some(t => {
      const ini = new Date(t.date);
      const fin = new Date(ini);
      fin.setMinutes(ini.getMinutes() + servicio.duration_min + 30);
      return horaInicio < fin && horaFin > ini;
    });

    if (haySolapamiento) {
      throw new BadRequestException('Ya existe un turno en ese horario');
    }

    // Si pasó todas las validaciones, guardar
    // Buscar usuario por UUID
    const usuario = await this.userRepo.findOne({ where: { uuid: dto.user_uuid } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Buscar servicio por UUID
    const servicioTurno = await this.servicioRepo.findOne({ where: { uuid: dto.servicio_uuid } });
    if (!servicioTurno) throw new NotFoundException('Servicio no encontrado');

    // Crear el turno usando los objetos
    const nuevoTurno = this.turnoRepo.create({
      ...dto,
      user: usuario,
      servicio: servicioTurno,
    });
    const guardado = await this.turnoRepo.save(nuevoTurno);

    const { id, deleted, ...rest } = guardado;
    return rest;
  }


  async findAll() {
    const turnos = await this.turnoRepo.find({ where: { deleted: false } });

    return turnos.map(({ deleted, id, ...rest }) => rest); // si bloques esta vacío devuelve []
  }


  async update(uuid: string, dto: UpdateAppointmentDto): Promise<any> {
    const turno = await this.turnoRepo.findOne({
      where: { uuid, deleted: false },
      relations: ['servicio'],
    });

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    // Solo si llega nueva fecha
    if (dto.date) {
      const nuevaFecha = new Date(dto.date);
      if (isNaN(nuevaFecha.getTime())) {
        throw new BadRequestException('Fecha inválida');
      }

      const horaInicio = new Date(dto.date);
      const horaTurno = horaInicio.toTimeString().split(':').slice(0, 2).join(':');
      const week_d = nuevaFecha.getDay();

      // Validar feriado
      const feriado = await this.feriadoRepo.findOne({ where: { date: nuevaFecha, deleted: false } });
      if (feriado) {
        throw new BadRequestException('No se pueden agendar turnos en feriados');
      }

      // Validar disponibilidad
      const bloques = await this.dispoRepo.find({ where: { week_day: week_d, deleted: false } });
      const duracionTotal = turno.servicio.duration_min + 30;
      const horaFin = new Date(horaInicio);
      horaFin.setMinutes(horaInicio.getMinutes() + duracionTotal);

      const enBloque = bloques.some(b =>
        horaTurno >= b.start &&
        horaFin.toTimeString().split(':').slice(0, 2).join(':') <= b.finish
      );

      if (!enBloque) {
        throw new BadRequestException('El turno está fuera del horario disponible');
      }

      // Validar superposición
      const turnos = await this.turnoRepo.find({ where: { deleted: false } });

      const fechaIso = nuevaFecha.toISOString().split('T')[0];
      const turnosMismoDia = turnos.filter(t => {
        if (!t.date) return false;
        const fechaTurno = new Date(t.date);
        const fechaTurnoIso = fechaTurno.toISOString().split('T')[0];
        return t.uuid !== uuid && fechaTurnoIso === fechaIso;
      });

      const haySolapamiento = turnosMismoDia.some(t => {
        const ini = new Date(t.date);
        const fin = new Date(ini);
        fin.setMinutes(ini.getMinutes() + turno.servicio.duration_min + 30);
        return horaInicio < fin && horaFin > ini;
      });

      if (haySolapamiento) {
        throw new BadRequestException('Ya existe un turno en ese horario');
      }

      turno.date = dto.date;
    }

    // Si llega un nuevo estado
    if (dto.state) {
      turno.state = dto.state;
    }

    const actualizado = await this.turnoRepo.save(turno);
    const { id, deleted, ...rest } = actualizado;
    return rest;
  }



  async remove(uuid:string) {
    const turno = await this.turnoRepo.findOne({ where: { uuid } });
    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    if (turno.deleted) {
      throw new BadRequestException('El turno ya está eliminado');
    }

    turno.deleted = true;

    await this.dispoRepo.save(turno);
  }
}
