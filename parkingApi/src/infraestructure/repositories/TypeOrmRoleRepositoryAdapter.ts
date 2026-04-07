import { Repository } from 'typeorm';
import { Role } from '../../domain/models/Role';
import { RoleRepositoryPort } from '../../domain/ports/out/RoleRepositoryPort';
import { RoleEntity } from '../entities/RoleEntity';

export class TypeOrmRoleRepositoryAdapter implements RoleRepositoryPort {
  constructor(private readonly roleRepository: Repository<RoleEntity>) {}

  async findAll(): Promise<Role[]> {
    const entities = await this.roleRepository.find();
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({ where: { id } });
    return entity ? entity.toDomainModel() : null;
  }

  async save(role: Role): Promise<Role> {
    const entity = RoleEntity.fromDomainModel(role);
    const savedEntity = await this.roleRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(role: Role): Promise<Role> {
    const entity = RoleEntity.fromDomainModel(role);
    const savedEntity = await this.roleRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
