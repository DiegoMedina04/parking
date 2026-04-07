import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PlanMensualidadEntity } from './PlanMensualidadEntity';
import { VehicleEntity } from './VehicleEntity';
import { ParkingEntity } from './ParkingEntity';
import { Mensualidad, MensualidadStatus } from '../../domain/models/Mensualidad';

@Entity('mensualidades')
export class MensualidadEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'fecha_inicio' })
    fechaInicio!: Date;

    @Column({ name: 'fecha_fin' })
    fechaFin!: Date;

    @Column({
        type: 'enum',
        enum: MensualidadStatus,
        default: MensualidadStatus.PENDIENTE
    })
    estado!: MensualidadStatus;

    @ManyToOne(() => PlanMensualidadEntity, { nullable: false })
    @JoinColumn({ name: 'tipo_plan_id' })
    plan!: PlanMensualidadEntity;

    @ManyToOne(() => VehicleEntity, { nullable: false })
    @JoinColumn({ name: 'vehiculo_id' })
    vehiculo!: VehicleEntity;

    @ManyToOne(() => ParkingEntity, { nullable: false })
    @JoinColumn({ name: 'parqueadero_id' })
    parqueadero!: ParkingEntity;

    static fromDomainModel(mensualidad: Mensualidad): MensualidadEntity {
        const entity = new MensualidadEntity();
        if (mensualidad.id) entity.id = mensualidad.id;
        entity.fechaInicio = mensualidad.fechaInicio;
        entity.fechaFin = mensualidad.fechaFin;
        entity.estado = mensualidad.estado;
        entity.plan = PlanMensualidadEntity.fromDomainModel(mensualidad.plan);
        entity.vehiculo = VehicleEntity.fromDomainModel(mensualidad.vehiculo);
        entity.parqueadero = ParkingEntity.fromDomainModel(mensualidad.parqueadero);
        return entity;
    }

    toDomainModel(): Mensualidad {
        return new Mensualidad(
            this.id,
            this.plan.toDomainModel(),
            this.fechaInicio,
            this.fechaFin,
            this.estado,
            this.vehiculo.toDomainModel(),
            this.parqueadero.toDomainModel()
        );
    }
}
