import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PlanMensualidad } from '../../domain/models/PlanMensualidad';

@Entity('plan_mensualidades')
export class PlanMensualidadEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'nombre' })
    nombre!: string;

    @Column({ name: 'duracion' })
    duracion!: string;

    @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
    valor!: number;

    @Column({ name: 'parqueadero_id' })
    parqueadero_id!: string;

    @Column({ name: 'tipo_vehiculo_id' })
    tipo_vehiculo_id!: string;

    static fromDomainModel(plan: PlanMensualidad): PlanMensualidadEntity {
        const entity = new PlanMensualidadEntity();
        if (plan.id) entity.id = plan.id;
        entity.nombre = plan.nombre;
        entity.duracion = plan.duracion;
        entity.valor = plan.valor;
        entity.parqueadero_id = plan.parqueadero_id;
        entity.tipo_vehiculo_id = plan.tipo_vehiculo_id;
        return entity;
    }

    toDomainModel(): PlanMensualidad {
        return new PlanMensualidad(
            this.id,
            this.nombre,
            this.duracion,
            Number(this.valor),
            this.parqueadero_id,
            this.tipo_vehiculo_id
        );
    }
}
