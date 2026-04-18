import { CreateTicketPaymentUseCase } from '../../domain/ports/in/ticketPayment/CreateTicketPaymentUseCase';
import { RetrieveTicketPaymentUseCase } from '../../domain/ports/in/ticketPayment/RetrieveTicketPaymentUseCase';
import { TicketPayment } from '../../domain/models/TicketPayment';

export class TicketPaymentService implements CreateTicketPaymentUseCase, RetrieveTicketPaymentUseCase {
    constructor(
        private readonly createTicketPaymentUseCase: CreateTicketPaymentUseCase,
        private readonly retrieveTicketPaymentUseCase: RetrieveTicketPaymentUseCase
    ) {}

    async save(payment: TicketPayment): Promise<TicketPayment> {
        return this.createTicketPaymentUseCase.save(payment);
    }

    async findAll(): Promise<TicketPayment[]> {
        return this.retrieveTicketPaymentUseCase.findAll();
    }

    async findById(id: string): Promise<TicketPayment | null> {
        return this.retrieveTicketPaymentUseCase.findById(id);
    }

    async findByTicketId(ticketId: string): Promise<TicketPayment | null> {
        return this.retrieveTicketPaymentUseCase.findByTicketId(ticketId);
    }

    async findByParkingAndDate(parkingId: string, date: Date): Promise<TicketPayment[]> {
        return this.retrieveTicketPaymentUseCase.findByParkingAndDate(parkingId, date);
    }
}
