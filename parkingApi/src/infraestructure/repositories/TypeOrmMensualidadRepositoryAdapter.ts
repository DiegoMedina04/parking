import { Repository } from 'typeorm';
import { MensualidadRepositoryPort } from '../../domain/ports/out/MensualidadRepositoryPort';
import { Mensualidad } from '../../domain/models/Mensualidad';
import { MensualidadEntity } from '../entities/MensualidadEntity';
import { AppDataSource } from '../config/DatabaseConfig';

export class TypeOrmMensualidadRepositoryAdapter implements MensualidadRepositoryPort {
    private readonly repository: Repository<MensualidadEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(MensualidadEntity);
    }

    async save(mensualidad: Mensualidad): Promise<Mensualidad> {
        const entity = MensualidadEntity.fromDomainModel(mensualidad);
        const savedEntity = await this.repository.save(entity);
        return savedEntity.toDomainModel();
    }

    async findById(id: string): Promise<Mensualidad | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['plan', 'vehiculo', 'parqueadero', 'vehiculo.type', 'vehiculo.client']
        });
        return entity ? entity.toDomainModel() : null;
    }

    async findAll(): Promise<Mensualidad[]> {
        const entities = await this.repository.find({
            relations: ['plan', 'vehiculo', 'vehiculo.type', 'parqueadero']
        });
        return entities.map(entity => entity.toDomainModel());
    }

    async findAllByParking(parkingId: string): Promise<Mensualidad[]> {
        const entities = await this.repository.find({
            where: { parqueadero: { id: parkingId } },
            relations: ['plan', 'vehiculo', 'vehiculo.type', 'parqueadero'],
            order: { fechaFin: 'DESC' }
        });
        return entities.map(entity => entity.toDomainModel());
    }

    async findByVehicleId(vehicleId: string): Promise<Mensualidad[]> {
        const entities = await this.repository.find({
            where: { vehiculo: { id: vehicleId } },
            relations: ['plan', 'vehiculo', 'vehiculo.type', 'parqueadero']
        });
        return entities.map(entity => entity.toDomainModel());
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async processPayment(paymentData: any): Promise<void> {
        const { mensualidadId, valor, metodoPago, parqueaderoId } = paymentData;

        await AppDataSource.transaction(async transactionalEntityManager => {
            // 1. Obtener mensualidad
            const mensualidad = await transactionalEntityManager.findOne(MensualidadEntity, {
                where: { id: mensualidadId },
                relations: ['plan']
            });

            if (!mensualidad) throw new Error('Mensualidad no encontrada');
            if (mensualidad.estado === 'PAGADA') throw new Error('La mensualidad ya se encuentra pagada');

            // 2. Registrar Pago
            const payment = transactionalEntityManager.create('MensualidadPaymentEntity', {
                mensualidadId,
                valor,
                metodoPago,
                parqueaderoId,
                estado: 'PAGADO'
            });
            await transactionalEntityManager.save(payment);

            // 3. Actualizar estado de Mensualidad a PAGADA
            mensualidad.estado = 'PAGADA' as any;
            await transactionalEntityManager.save(mensualidad);
        });
    }
}
