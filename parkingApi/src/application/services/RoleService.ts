import { Role } from '../../domain/models/Role';
import { CreateRoleUseCase } from '../../domain/ports/in/role/CreateRoleUseCase';
import { RetrieveRoleUseCase } from '../../domain/ports/in/role/RetrieveRoleUseCase';
import { UpdateRoleUseCase } from '../../domain/ports/in/role/UpdateRoleUseCase';
import { DeleteRoleUseCase } from '../../domain/ports/in/role/DeleteRoleUseCase';

export class RoleService implements RetrieveRoleUseCase, CreateRoleUseCase, UpdateRoleUseCase, DeleteRoleUseCase {
  constructor(
    private readonly retrieveRoleUseCase: RetrieveRoleUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase
  ) {}

  async getRoles(): Promise<Role[]> {
    return this.retrieveRoleUseCase.getRoles();
  }

  async save(role: Role): Promise<Role> {
    return this.createRoleUseCase.save(role);
  }

  async update(role: Role): Promise<Role> {
    return this.updateRoleUseCase.update(role);
  }

  async delete(id: string): Promise<void> {
    return this.deleteRoleUseCase.delete(id);
  }
}
