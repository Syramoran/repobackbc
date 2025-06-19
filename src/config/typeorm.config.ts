import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Disponibilidad } from 'src/disponibilidad/entities/disponibilidad.entity';
import { Feriado } from 'src/feriados/entities/feriado.entity';
import { Log } from 'src/logs/entities/log.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { User } from 'src/users/entities/user.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Appointment,Disponibilidad,Feriado,Servicio,User,Log],
  synchronize: true, // ¡solo en desarrollo!
};
