import { CreateTicketUseCase } from '../../../domain/ports/in/ticket/CreateTicketUseCase';
import { Ticket } from '../../../domain/models/Ticket';
import { TicketRepositoryPort } from '../../../domain/ports/out/TicketRepositoryPort';
import { VehicleRepositoryPort } from '../../../domain/ports/out/VehicleRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';
import { BadRequestError } from '../../../domain/exceptions/BadRequestError';

export class CreateTicketUseCaseImpl implements CreateTicketUseCase {
    constructor(
        private readonly ticketRepositoryPort: TicketRepositoryPort,
        private readonly vehicleRepositoryPort: VehicleRepositoryPort
    ) {}

    async save(ticket: Ticket): Promise<Ticket> {
        const vehicle = await this.vehicleRepositoryPort.findById(ticket.vehicle.id);
        if (!vehicle) {
            throw new NotFoundError(`Vehicle with ID ${ticket.vehicle.id} not found.`);
        }

        const activeTicket = await this.ticketRepositoryPort.findActiveByVehicleId(vehicle.id);
        if (activeTicket) {
            throw new BadRequestError(`El vehículo con placa ${vehicle.licensePlate} ya tiene un ticket abierto en esta sede.`);
        }

        return this.ticketRepositoryPort.save(ticket);
    }
}
