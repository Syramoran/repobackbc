import { Appointment } from "src/appointments/entities/appointment.entity";
import { Role } from "src/auth/dto/roles.enum";
import { BeforeInsert, Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 36, unique: true })
    uuid: string;

    @Column({ type: 'varchar', length: '255', nullable: false })
    name: string;

    @Column({ type: 'varchar', length: '255', unique: true, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: '255', nullable: false, unique: true })
    number: string;

    @Column({ type: 'varchar', length: '255', nullable: false })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    rol: Role;

    @DeleteDateColumn()
  deletedAt: Date;

    @OneToMany(() => Appointment, (app) => app.user)
    appointments: Appointment[];

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }
}
