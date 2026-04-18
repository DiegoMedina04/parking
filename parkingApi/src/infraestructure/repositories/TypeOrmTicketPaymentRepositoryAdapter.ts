import { Repository, Between } from 'typeorm';
import { TicketPaymentRepositoryPort } from '../../domain/ports/out/TicketPaymentRepositoryPort';
import { TicketPayment } from '../../domain/models/TicketPayment';
import { TicketPaymentEntity } from '../entities/TicketPaymentEntity';
import { AppDataSource } from '../config/DatabaseConfig';

export class TypeOrmTicketPaymentRepositoryAdapter implements TicketPaymentRepositoryPort {
    private readonly repository: Repository<TicketPaymentEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(TicketPaymentEntity);
    }

    async save(payment: TicketPayment): Promise<TicketPayment> {
        const entity = TicketPaymentEntity.fromDomainModel(payment);
        const savedEntity = await this.repository.save(entity);
        return savedEntity.toDomainModel();
    }

    async findById(id: string): Promise<TicketPayment | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['ticket', 'ticket.vehicle', 'ticket.vehicle.type', 'parking']
        });
        return entity ? entity.toDomainModel() : null;
    }

    async findAll(): Promise<TicketPayment[]> {
        const entities = await this.repository.find({
            relations: ['ticket', 'ticket.vehicle', 'ticket.vehicle.type', 'parking']
        });
        return entities.map(entity => entity.toDomainModel());
    }

    async findByTicketId(ticketId: string): Promise<TicketPayment | null> {
        const entity = await this.repository.findOne({
            where: { ticket: { id: ticketId } },
            relations: ['ticket', 'ticket.vehicle', 'ticket.vehicle.type', 'parking']
        });
        return entity ? entity.toDomainModel() : null;
    }

    async findByParkingAndDate(parkingId: string, date: Date): Promise<TicketPayment[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const entities = await this.repository.find({
            where: {
                parking: { id: parkingId },
                paymentDate: Between(startOfDay, endOfDay)
            },
            relations: ['ticket', 'ticket.vehicle', 'ticket.vehicle.type', 'parking'],
            order: { paymentDate: 'DESC' }
        });

        return entities.map(entity => entity.toDomainModel());
    }
}
