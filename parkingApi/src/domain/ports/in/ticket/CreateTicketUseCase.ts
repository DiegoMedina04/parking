import { Ticket } from '../../../../domain/models/Ticket';

export interface CreateTicketUseCase {
    save(ticket: Ticket): Promise<Ticket>;
}
