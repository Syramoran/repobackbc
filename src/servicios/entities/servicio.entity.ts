import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity('servicios')
export class Servicio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 36, unique: true })
    uuid: string;

    @Column({ type: 'varchar', length: '255', nullable: false })
    name: string;

    @Column({ type: 'varchar', length: '255', nullable: false })
    description: string;

    @Column({ type: 'int' })
    duration_min: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;



    @BeforeInsert()
    generateUuid() {
        this.uuid = uuidv4();
    }
}