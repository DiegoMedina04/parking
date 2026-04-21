import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FeeEntity } from './FeeEntity';
import { VehicleEntity } from './VehicleEntity';
import { ParkingEntity } from './ParkingEntity';
import { Mensualidad, MensualidadStatus } from '../../domain/models/Mensualidad';
import { PlanMensualidad } from '../../domain/models/PlanMensualidad';

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

    @ManyToOne(() => FeeEntity, { nullable: false })
    @JoinColumn({ name: 'tipo_plan_id' })
    plan!: FeeEntity;

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
        
        // Mapeamos el modelo PlanMensualidad de vuelta a FeeEntity
        entity.plan = FeeEntity.fromDomainModel({
            id: mensualidad.plan.id,
            nombre_tarifa: mensualidad.plan.nombre,
            valor: mensualidad.plan.valor,
            tiempo_minutos: 43200, // Reconstituimos el tiempo mensual
            tipo_vehiculo_id: mensualidad.plan.tipo_vehiculo_id,
            parqueadero_id: mensualidad.plan.parqueadero_id
        } as any);

        entity.vehiculo = VehicleEntity.fromDomainModel(mensualidad.vehiculo);
        entity.parqueadero = ParkingEntity.fromDomainModel(mensualidad.parqueadero);
        return entity;
    }

    toDomainModel(): Mensualidad {
        // Mapeamos FeeEntity al modelo PlanMensualidad del dominio
        const mappedPlan = new PlanMensualidad(
            this.plan.id,
            this.plan.nombre_tarifa,
            `${this.plan.tiempo_minutos} min`,
            Number(this.plan.valor),
            this.plan.parqueadero_id,
            this.plan.tipo_vehiculo_id
        );

        return new Mensualidad(
            this.id,
            mappedPlan,
            this.fechaInicio,
            this.fechaFin,
            this.estado,
            this.vehiculo.toDomainModel(),
            this.parqueadero.toDomainModel()
        );
    }
}
