import { Role } from '../../domain/models/Role';
import { CreateRoleUseCase } from '../../domain/ports/in/role/CreateRoleUseCase';
import { RetrieveRoleUseCase } from '../../domain/ports/in/role/RetrieveRoleUseCase';

export class RoleService implements RetrieveRoleUseCase, CreateRoleUseCase {
  constructor(
    private readonly retrieveRoleUseCase: RetrieveRoleUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase
  ) {}

  async getRoles(): Promise<Role[]> {
    return this.retrieveRoleUseCase.getRoles();
  }

  async save(role: Role): Promise<Role> {
    return this.createRoleUseCase.save(role);
  }
}
