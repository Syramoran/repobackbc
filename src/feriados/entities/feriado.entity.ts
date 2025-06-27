import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity('feriados')
export class Feriado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'boolean', default: false })
  anual: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

}
