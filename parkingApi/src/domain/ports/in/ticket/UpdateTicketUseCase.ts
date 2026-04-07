import { Ticket } from '../../../models/Ticket';

export interface UpdateTicketUseCase {
    checkout(id: string, exitDate?: Date): Promise<Ticket>;
}
