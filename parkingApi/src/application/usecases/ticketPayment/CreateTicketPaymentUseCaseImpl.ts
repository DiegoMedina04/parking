import { CreateTicketPaymentUseCase } from '../../../domain/ports/in/ticketPayment/CreateTicketPaymentUseCase';
import { TicketPayment } from '../../../domain/models/TicketPayment';
import { TicketPaymentRepositoryPort } from '../../../domain/ports/out/TicketPaymentRepositoryPort';
import { TicketRepositoryPort } from '../../../domain/ports/out/TicketRepositoryPort';
import { ParkingRepositoryPort } from '../../../domain/ports/out/ParkingRepositoryPort';
import { BadRequestError } from '../../../domain/exceptions/BadRequestError';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class CreateTicketPaymentUseCaseImpl implements CreateTicketPaymentUseCase {
    constructor(
        private readonly ticketPaymentRepository: TicketPaymentRepositoryPort,
        private readonly ticketRepository: TicketRepositoryPort,
        private readonly parkingRepository: ParkingRepositoryPort
    ) {}

    async save(payment: TicketPayment): Promise<TicketPayment> {
        // Validar Ticket
        const ticket = await this.ticketRepository.findById(payment.ticket.id);
        if (!ticket) {
            throw new NotFoundError(`Ticket con ID ${payment.ticket.id} no encontrado.`);
        }

        // Validar Parqueadero
        const parking = await this.parkingRepository.findById(payment.parking.id);
        if (!parking) {
            throw new NotFoundError(`Parqueadero con ID ${payment.parking.id} no encontrado.`);
        }

        // Validación: No se puede agregar el mismo ticket (mismo ID de ticket en pagos)
        const existingPayment = await this.ticketPaymentRepository.findByTicketId(payment.ticket.id);
        if (existingPayment) {
            throw new BadRequestError(`El ticket con ID ${payment.ticket.id} ya tiene un pago registrado.`);
        }

        // Asegurar que el modelo guardado tiene los datos completos de las relaciones
        payment.ticket = ticket;
        payment.parking = parking;

        return this.ticketPaymentRepository.save(payment);
    }
}
