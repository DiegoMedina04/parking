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
            relations: ['plan', 'vehiculo', 'parqueadero', 'vehiculo.vehicleType', 'vehiculo.client']
        });
        return entity ? entity.toDomainModel() : null;
    }

    async findAll(): Promise<Mensualidad[]> {
        const entities = await this.repository.find({
            relations: ['plan', 'vehiculo', 'parqueadero']
        });
        return entities.map(entity => entity.toDomainModel());
    }

    async findByVehicleId(vehicleId: string): Promise<Mensualidad[]> {
        const entities = await this.repository.find({
            where: { vehiculo: { id: vehicleId } },
            relations: ['plan', 'vehiculo', 'parqueadero']
        });
        return entities.map(entity => entity.toDomainModel());
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
