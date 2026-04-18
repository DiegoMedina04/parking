import { Repository } from 'typeorm';
import { TicketRepositoryPort } from '../../domain/ports/out/TicketRepositoryPort';
import { Ticket, TicketStatus } from '../../domain/models/Ticket';
import { TicketEntity } from '../entities/TicketEntity';
import { TicketPayment } from '../../domain/models/TicketPayment';
import { TicketPaymentEntity } from '../entities/TicketPaymentEntity';

export class TypeOrmTicketRepositoryAdapter implements TicketRepositoryPort {
    constructor(private readonly ticketRepository: Repository<TicketEntity>) {}

    async findAll(status?: string, parqueadero_id?: string): Promise<Ticket[]> {
        const whereClause: any = {};
        if (status) whereClause.status = status;
        if (parqueadero_id) whereClause.parking = { id: parqueadero_id };
        
        const entities = await this.ticketRepository.find({ 
            where: whereClause,
            relations: ['vehicle', 'vehicle.type', 'vehicle.client', 'parking'] 
        });
        return entities.map(entity => entity.toDomainModel());
    }

    async findById(id: string): Promise<Ticket | null> {
        const entity = await this.ticketRepository.findOne({ 
            where: { id }, 
            relations: ['vehicle', 'parking'] 
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
            relations: ['vehicle', 'parking']
        });
        return entity ? entity.toDomainModel() : null;
    }

    async checkout(ticket: Ticket, payment: TicketPayment): Promise<Ticket> {
        return await this.ticketRepository.manager.transaction(async (transactionalEntityManager) => {
            // 1. Actualizar Ticket
            const ticketEntity = TicketEntity.fromDomainModel(ticket);
            const savedTicket = await transactionalEntityManager.save(TicketEntity, ticketEntity);
            
            // 2. Registrar Pago
            const paymentEntity = TicketPaymentEntity.fromDomainModel(payment);
            await transactionalEntityManager.save(TicketPaymentEntity, paymentEntity);
            
            return savedTicket.toDomainModel();
        });
    }
}
