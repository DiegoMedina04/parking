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

    static fromDomainModel(plan: PlanMensualidad): PlanMensualidadEntity {
        const entity = new PlanMensualidadEntity();
        if (plan.id) entity.id = plan.id;
        entity.nombre = plan.nombre;
        entity.duracion = plan.duracion;
        entity.valor = plan.valor;
        return entity;
    }

    toDomainModel(): PlanMensualidad {
        return new PlanMensualidad(
            this.id,
            this.nombre,
            this.duracion,
            Number(this.valor)
        );
    }
}
