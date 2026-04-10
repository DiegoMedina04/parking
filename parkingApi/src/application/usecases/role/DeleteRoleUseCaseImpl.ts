import { DeleteRoleUseCase } from '../../../domain/ports/in/role/DeleteRoleUseCase';
import { RoleRepositoryPort } from '../../../domain/ports/out/RoleRepositoryPort';

export class DeleteRoleUseCaseImpl implements DeleteRoleUseCase {
  constructor(private readonly roleRepositoryPort: RoleRepositoryPort) {}

  async delete(id: string): Promise<void> {
    return this.roleRepositoryPort.delete(id);
  }
}
