import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Disponibility } from 'src/disponibilidad/entities/disponibilidad.entity';
import { Feriado } from 'src/feriados/entities/feriado.entity';
import { Log } from 'src/logs/entities/log.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { User } from 'src/users/entities/user.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  driver: require('mysql2'), // opcional
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Appointment,Disponibility,Feriado,Servicio,User],
  synchronize: true, // ¡solo en desarrollo!
};
