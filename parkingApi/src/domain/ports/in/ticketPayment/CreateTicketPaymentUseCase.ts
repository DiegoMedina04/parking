import { TicketPayment } from '../../../models/TicketPayment';

export interface CreateTicketPaymentUseCase {
    save(payment: TicketPayment): Promise<TicketPayment>;
}
