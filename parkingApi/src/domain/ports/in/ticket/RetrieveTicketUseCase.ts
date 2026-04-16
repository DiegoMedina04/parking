import { Ticket } from '../../../../domain/models/Ticket';

export interface RetrieveTicketUseCase {
    getTickets(status?: string, parqueadero_id?: string): Promise<Ticket[]>;
    findById(id: string): Promise<Ticket | null>;
    getActiveTicketByVehicleId(vehicleId: string): Promise<Ticket | null>;
}
