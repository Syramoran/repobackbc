import { Servicio } from "src/servicios/entities/servicio.entity";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Estados } from "src/common/enum-estados";


@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 36, unique: true })
    uuid: string;

    @Column({ type: 'timestamp', nullable: false })
    date: Date;

    @Column({ type: 'enum', enum: Estados, default: Estados.PENDIENTE })
    state?: Estados;

    @DeleteDateColumn()
  deletedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User

    @ManyToOne(() => Servicio)
    @JoinColumn({ name: 'servicio_id' })
    servicio: Servicio

    @Column({ type: 'text', nullable: true })
    detalle?: string;

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }
}
