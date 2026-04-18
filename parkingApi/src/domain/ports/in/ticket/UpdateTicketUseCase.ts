import { Ticket } from '../../../models/Ticket';

export interface UpdateTicketUseCase {
    checkout(id: string, amount: number, paymentMethod: string, exitDate?: Date): Promise<Ticket>;
}
