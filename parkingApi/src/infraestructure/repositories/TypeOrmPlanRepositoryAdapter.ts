import { Repository } from 'typeorm';
import { Plan } from '../../domain/models/Plan';
import { PlanRepositoryPort } from '../../domain/ports/out/PlanRepositoryPort';
import { PlanEntity } from '../entities/PlanEntity';

export class TypeOrmPlanRepositoryAdapter implements PlanRepositoryPort {
  constructor(private readonly planRepository: Repository<PlanEntity>) {}

  async findAll(): Promise<Plan[]> {
    const entities = await this.planRepository.find({ relations: ['subscription'] });
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<Plan | null> {
    const entity = await this.planRepository.findOne({ 
      where: { id }, 
      relations: ['subscription'] 
    });
    return entity ? entity.toDomainModel() : null;
  }

  async save(plan: Plan): Promise<Plan> {
    const entity = PlanEntity.fromDomainModel(plan);
    const savedEntity = await this.planRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(plan: Plan): Promise<Plan> {
    const entity = PlanEntity.fromDomainModel(plan);
    const savedEntity = await this.planRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.planRepository.delete(id);
  }
}
