import { RetrieveTicketUseCase } from '../../../domain/ports/in/ticket/RetrieveTicketUseCase';
import { Ticket } from '../../../domain/models/Ticket';
import { TicketRepositoryPort } from '../../../domain/ports/out/TicketRepositoryPort';

export class RetrieveTicketUseCaseImpl implements RetrieveTicketUseCase {
    constructor(private readonly ticketRepositoryPort: TicketRepositoryPort) {}

    async getTickets(status?: string, parqueadero_id?: string): Promise<Ticket[]> {
        return this.ticketRepositoryPort.findAll(status, parqueadero_id);
    }

    async findById(id: string): Promise<Ticket | null> {
        return this.ticketRepositoryPort.findById(id);
    }

    async getActiveTicketByVehicleId(vehicleId: string): Promise<Ticket | null> {
        return this.ticketRepositoryPort.findActiveByVehicleId(vehicleId);
    }
}
