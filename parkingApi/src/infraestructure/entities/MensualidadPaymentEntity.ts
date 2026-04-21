import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { MensualidadEntity } from './MensualidadEntity';
import { ParkingEntity } from './ParkingEntity';

export enum PaymentStatus {
    PAGADO = 'PAGADO',
    PENDIENTE = 'PENDIENTE',
    ANULADO = 'ANULADO'
}

@Entity('pagos_mensualidad')
export class MensualidadPaymentEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'mensualidad_id' })
    mensualidadId!: string;

    @ManyToOne(() => MensualidadEntity, { nullable: false })
    @JoinColumn({ name: 'mensualidad_id' })
    mensualidad!: MensualidadEntity;

    @CreateDateColumn({ name: 'fecha_pago' })
    fechaPago!: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    valor!: number;

    @Column({ name: 'metodo_pago' })
    metodoPago!: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PAGADO
    })
    estado!: PaymentStatus;

    @Column({ name: 'parqueadero_id' })
    parqueaderoId!: string;

    @ManyToOne(() => ParkingEntity, { nullable: false })
    @JoinColumn({ name: 'parqueadero_id' })
    parqueadero!: ParkingEntity;
}
