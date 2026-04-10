import { Role } from '../../../domain/models/Role';
import { UpdateRoleUseCase } from '../../../domain/ports/in/role/UpdateRoleUseCase';
import { RoleRepositoryPort } from '../../../domain/ports/out/RoleRepositoryPort';

export class UpdateRoleUseCaseImpl implements UpdateRoleUseCase {
  constructor(private readonly roleRepositoryPort: RoleRepositoryPort) {}

  async update(role: Role): Promise<Role> {
    return this.roleRepositoryPort.update(role);
  }
}
