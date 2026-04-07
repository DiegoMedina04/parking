import { Role } from '../../../domain/models/Role';
import { RetrieveRoleUseCase } from '../../../domain/ports/in/role/RetrieveRoleUseCase';
import { RoleRepositoryPort } from '../../../domain/ports/out/RoleRepositoryPort';

export class RetrieveRoleUseCaseImpl implements RetrieveRoleUseCase {
  constructor(private readonly roleRepositoryPort: RoleRepositoryPort) {}

  async getRoles(): Promise<Role[]> {
    return this.roleRepositoryPort.findAll();
  }
}
