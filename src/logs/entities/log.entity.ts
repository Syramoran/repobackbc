import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { User } from '../../users/entities/user.entity';

export enum LogAction {
  CREAR = 'crear',
  MODIFICAR = 'modificar',
  CANCELAR = 'cancelar',
  CAMBIAR_ESTADO = 'cambiar_estado',
  REPROGRAMAR = 'reprogramar',
  PAGO = 'pago',
}

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: LogAction })
  action: LogAction;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Appointment)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

}
