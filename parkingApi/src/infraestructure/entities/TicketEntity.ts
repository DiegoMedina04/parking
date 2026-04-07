import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { VehicleEntity } from './VehicleEntity';
import { Ticket, TicketStatus } from '../../domain/models/Ticket';

@Entity('tickets')
export class TicketEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ name: 'entry_date' })
    entryDate!: Date;

    @Column({ name: 'exit_date', type: 'timestamp', nullable: true })
    exitDate!: Date | null;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN
    })
    status!: TicketStatus;

    @ManyToOne(() => VehicleEntity)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle!: VehicleEntity;

    static fromDomainModel(ticket: Ticket): TicketEntity {
        const entity = new TicketEntity();
        entity.id = ticket.id;
        entity.entryDate = ticket.entryDate;
        entity.exitDate = ticket.exitDate;
        entity.status = ticket.status;
        entity.vehicle = VehicleEntity.fromDomainModel(ticket.vehicle);
        return entity;
    }

    toDomainModel(): Ticket {
        return new Ticket(
            this.id,
            this.vehicle.toDomainModel(),
            this.entryDate,
            this.exitDate,
            this.status
        );
    }
}
