import { Repository } from 'typeorm';
import { PlanMensualidadRepositoryPort } from '../../domain/ports/out/PlanMensualidadRepositoryPort';
import { PlanMensualidad } from '../../domain/models/PlanMensualidad';
import { PlanMensualidadEntity } from '../entities/PlanMensualidadEntity';
import { AppDataSource } from '../config/DatabaseConfig';

export class TypeOrmPlanMensualidadRepositoryAdapter implements PlanMensualidadRepositoryPort {
    private readonly repository: Repository<PlanMensualidadEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(PlanMensualidadEntity);
    }

    async save(plan: PlanMensualidad): Promise<PlanMensualidad> {
        const entity = PlanMensualidadEntity.fromDomainModel(plan);
        const savedEntity = await this.repository.save(entity);
        return savedEntity.toDomainModel();
    }

    async findById(id: string): Promise<PlanMensualidad | null> {
        const entity = await this.repository.findOneBy({ id });
        return entity ? entity.toDomainModel() : null;
    }

    async findAll(): Promise<PlanMensualidad[]> {
        const entities = await this.repository.find();
        return entities.map(entity => entity.toDomainModel());
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
