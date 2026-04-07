import { Ticket } from '../../../../domain/models/Ticket';

export interface RetrieveTicketUseCase {
    getTickets(): Promise<Ticket[]>;
    findById(id: string): Promise<Ticket | null>;
    getActiveTicketByVehicleId(vehicleId: string): Promise<Ticket | null>;
}
