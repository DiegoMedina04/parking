import { CreateTicketUseCase } from '../../domain/ports/in/ticket/CreateTicketUseCase';
import { RetrieveTicketUseCase } from '../../domain/ports/in/ticket/RetrieveTicketUseCase';
import { UpdateTicketUseCase } from '../../domain/ports/in/ticket/UpdateTicketUseCase';
import { Ticket } from '../../domain/models/Ticket';

export class TicketService implements CreateTicketUseCase, RetrieveTicketUseCase, UpdateTicketUseCase {
    constructor(
        private readonly retrieveTicketUseCase: RetrieveTicketUseCase,
        private readonly createTicketUseCase: CreateTicketUseCase,
        private readonly updateTicketUseCase: UpdateTicketUseCase
    ) {}

    async getTickets(status?: string, parqueadero_id?: string): Promise<Ticket[]> {
        return this.retrieveTicketUseCase.getTickets(status, parqueadero_id);
    }

    async findById(id: string): Promise<Ticket | null> {
        return this.retrieveTicketUseCase.findById(id);
    }

    async getActiveTicketByVehicleId(vehicleId: string): Promise<Ticket | null> {
        return this.retrieveTicketUseCase.getActiveTicketByVehicleId(vehicleId);
    }

    async save(ticket: Ticket): Promise<Ticket> {
        return this.createTicketUseCase.save(ticket);
    }

    async checkout(id: string, amount: number, paymentMethod: string, exitDate?: Date): Promise<Ticket> {
        return this.updateTicketUseCase.checkout(id, amount, paymentMethod, exitDate);
    }
}
