import { Ticket } from '../../models/Ticket';
import { TicketPayment } from '../../models/TicketPayment';

export interface TicketRepositoryPort {
    findAll(status?: string, parqueadero_id?: string): Promise<Ticket[]>;
    findById(id: string): Promise<Ticket | null>;
    save(ticket: Ticket): Promise<Ticket>;
    update(ticket: Ticket): Promise<Ticket>;
    delete(id: string): Promise<void>;
    findActiveByVehicleId(vehicleId: string): Promise<Ticket | null>;
    checkout(ticket: Ticket, payment: TicketPayment): Promise<Ticket>;
}
