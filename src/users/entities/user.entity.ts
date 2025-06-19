import { Appointment } from "src/appointments/entities/appointment.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 36, unique: true })
    uuid: string;

    @Column({ type: 'varchar', length: '255', nullable: false })
    name: string;

    @Column({ type: 'varchar', length: '255', nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', length: '255', nullable: false, unique: true })
    number: string;

    @Column({ type: 'varchar', length: '255', nullable: false })
    password: string;

    @Column({ type: 'boolean', default: false })
    admin: boolean;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;

    @OneToMany(()=> Appointment, (app)=> app.user)
    appointments:Appointment[];

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }
}
