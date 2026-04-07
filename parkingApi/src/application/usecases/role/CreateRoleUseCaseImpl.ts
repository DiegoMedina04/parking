import { Role } from '../../../domain/models/Role';
import { CreateRoleUseCase } from '../../../domain/ports/in/role/CreateRoleUseCase';
import { RoleRepositoryPort } from '../../../domain/ports/out/RoleRepositoryPort';

export class CreateRoleUseCaseImpl implements CreateRoleUseCase {
  constructor(private readonly roleRepositoryPort: RoleRepositoryPort) {}

  async save(role: Role): Promise<Role> {
    return this.roleRepositoryPort.save(role);
  }
}
