import { TicketPayment } from '../../../models/TicketPayment';

export interface RetrieveTicketPaymentUseCase {
    findAll(): Promise<TicketPayment[]>;
    findById(id: string): Promise<TicketPayment | null>;
    findByTicketId(ticketId: string): Promise<TicketPayment | null>;
    findByParkingAndDate(parkingId: string, date: Date): Promise<TicketPayment[]>;
}
