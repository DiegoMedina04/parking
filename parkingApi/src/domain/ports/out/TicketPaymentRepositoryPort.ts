import { TicketPayment } from '../../models/TicketPayment';

export interface TicketPaymentRepositoryPort {
    save(payment: TicketPayment): Promise<TicketPayment>;
    findById(id: string): Promise<TicketPayment | null>;
    findAll(): Promise<TicketPayment[]>;
    findByTicketId(ticketId: string): Promise<TicketPayment | null>;
    findByParkingAndDate(parkingId: string, date: Date): Promise<TicketPayment[]>;
}
