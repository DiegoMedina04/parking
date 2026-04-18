import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { TicketEntity } from './TicketEntity';
import { ParkingEntity } from './ParkingEntity';
import { TicketPayment } from '../../domain/models/TicketPayment';

@Entity('pago_tickets')
export class TicketPaymentEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'fecha_pago' })
    paymentDate!: Date;

    @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
    amount!: number;

    @Column({ name: 'metodo_pago' })
    paymentMethod!: string;

    @OneToOne(() => TicketEntity, { nullable: false })
    @JoinColumn({ name: 'ticket_id' })
    ticket!: TicketEntity;

    @ManyToOne(() => ParkingEntity, { nullable: false })
    @JoinColumn({ name: 'parqueadero_id' })
    parking!: ParkingEntity;

    static fromDomainModel(payment: TicketPayment): TicketPaymentEntity {
        const entity = new TicketPaymentEntity();
        if (payment.id) entity.id = payment.id;
        entity.paymentDate = payment.paymentDate;
        entity.amount = payment.amount;
        entity.paymentMethod = payment.paymentMethod;
        entity.ticket = TicketEntity.fromDomainModel(payment.ticket);
        entity.parking = ParkingEntity.fromDomainModel(payment.parking);
        return entity;
    }

    toDomainModel(): TicketPayment {
        return new TicketPayment(
            this.id,
            this.ticket?.toDomainModel(),
            this.paymentDate,
            Number(this.amount),
            this.paymentMethod,
            this.parking?.toDomainModel()
        );
    }
}
