import { Repository } from 'typeorm';
import { User } from '../../domain/models/User';
import { UserRepositoryPort } from '../../domain/ports/out/UserRepositoryPort';
import { UserEntity } from '../entities/UserEntity';

export class TypeOrmUserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly userRepository: Repository<UserEntity>) {}

  async findAll(): Promise<User[]> {
    const entities = await this.userRepository.find({ relations: ['role', 'parking'] });
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ 
      where: { id }, 
      relations: ['role', 'parking'] 
    });
    return entity ? entity.toDomainModel() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ 
      where: { email }, 
      relations: ['role', 'parking'] 
    });
    return entity ? entity.toDomainModel() : null;
  }

  async save(user: User): Promise<User> {
    const entity = UserEntity.fromDomainModel(user);
    const savedEntity = await this.userRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(user: User): Promise<User> {
    const entity = UserEntity.fromDomainModel(user);
    const savedEntity = await this.userRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
