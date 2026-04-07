import { UpdateTicketUseCase } from '../../../domain/ports/in/ticket/UpdateTicketUseCase';
import { Ticket, TicketStatus } from '../../../domain/models/Ticket';
import { TicketRepositoryPort } from '../../../domain/ports/out/TicketRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class UpdateTicketUseCaseImpl implements UpdateTicketUseCase {
    constructor(private readonly ticketRepositoryPort: TicketRepositoryPort) {}

    async checkout(id: string, exitDate?: Date): Promise<Ticket> {
        const ticket = await this.ticketRepositoryPort.findById(id);
        if (!ticket) {
            throw new NotFoundError(`Ticket with ID ${id} not found.`);
        }

        if (ticket.status === TicketStatus.CLOSED) {
            throw new Error(`Ticket with ID ${id} is already closed.`);
        }

        ticket.exitDate = exitDate || new Date();
        ticket.status = TicketStatus.CLOSED;

        return this.ticketRepositoryPort.save(ticket);
    }
}
