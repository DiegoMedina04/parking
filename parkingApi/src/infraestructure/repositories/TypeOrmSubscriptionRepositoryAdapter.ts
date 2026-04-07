import { Repository } from 'typeorm';
import { Subscription } from '../../domain/models/Subscription';
import { SubscriptionRepositoryPort } from '../../domain/ports/out/SubscriptionRepositoryPort';
import { SubscriptionEntity } from '../entities/SubscriptionEntity';

export class TypeOrmSubscriptionRepositoryAdapter implements SubscriptionRepositoryPort {
  constructor(private readonly subscriptionRepository: Repository<SubscriptionEntity>) {}

  async findAll(): Promise<Subscription[]> {
    const entities = await this.subscriptionRepository.find({ relations: ['parking', 'plan'] });
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<Subscription | null> {
    const entity = await this.subscriptionRepository.findOne({ 
      where: { id }, 
      relations: ['parking', 'plan'] 
    });
    return entity ? entity.toDomainModel() : null;
  }

  async save(subscription: Subscription): Promise<Subscription> {
    const entity = SubscriptionEntity.fromDomainModel(subscription);
    const savedEntity = await this.subscriptionRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const entity = SubscriptionEntity.fromDomainModel(subscription);
    const savedEntity = await this.subscriptionRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}
