import { Repository } from 'typeorm';
import { TicketRepositoryPort } from '../../domain/ports/out/TicketRepositoryPort';
import { Ticket, TicketStatus } from '../../domain/models/Ticket';
import { TicketEntity } from '../entities/TicketEntity';

export class TypeOrmTicketRepositoryAdapter implements TicketRepositoryPort {
    constructor(private readonly ticketRepository: Repository<TicketEntity>) {}

    async findAll(): Promise<Ticket[]> {
        const entities = await this.ticketRepository.find({ relations: ['vehicle'] });
        return entities.map(entity => entity.toDomainModel());
    }

    async findById(id: string): Promise<Ticket | null> {
        const entity = await this.ticketRepository.findOne({ 
            where: { id }, 
            relations: ['vehicle'] 
        });
        return entity ? entity.toDomainModel() : null;
    }

    async save(ticket: Ticket): Promise<Ticket> {
        const entity = TicketEntity.fromDomainModel(ticket);
        const savedEntity = await this.ticketRepository.save(entity);
        return savedEntity.toDomainModel();
    }

    async update(ticket: Ticket): Promise<Ticket> {
        const entity = TicketEntity.fromDomainModel(ticket);
        const updatedEntity = await this.ticketRepository.save(entity);
        return updatedEntity.toDomainModel();
    }

    async delete(id: string): Promise<void> {
        await this.ticketRepository.delete(id);
    }

    async findActiveByVehicleId(vehicleId: string): Promise<Ticket | null> {
        const entity = await this.ticketRepository.findOne({
            where: { 
                vehicle: { id: vehicleId },
                status: TicketStatus.OPEN
            },
            relations: ['vehicle']
        });
        return entity ? entity.toDomainModel() : null;
    }
}
