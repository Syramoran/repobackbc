import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { Days } from 'src/common/enum-days';

@Entity('disponibilidad')
export class Disponibility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Days })
  week_day: Days;

  @Column({ type: 'time' })
  start: string;

  @Column({ type: 'time' })
  finish: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

}
