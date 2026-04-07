import { RetrieveTicketPaymentUseCase } from '../../../domain/ports/in/ticketPayment/RetrieveTicketPaymentUseCase';
import { TicketPayment } from '../../../domain/models/TicketPayment';
import { TicketPaymentRepositoryPort } from '../../../domain/ports/out/TicketPaymentRepositoryPort';

export class RetrieveTicketPaymentUseCaseImpl implements RetrieveTicketPaymentUseCase {
    constructor(private readonly ticketPaymentRepository: TicketPaymentRepositoryPort) {}

    async findAll(): Promise<TicketPayment[]> {
        return this.ticketPaymentRepository.findAll();
    }

    async findById(id: string): Promise<TicketPayment | null> {
        return this.ticketPaymentRepository.findById(id);
    }

    async findByTicketId(ticketId: string): Promise<TicketPayment | null> {
        return this.ticketPaymentRepository.findByTicketId(ticketId);
    }
}
