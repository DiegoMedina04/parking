import { Role } from '../../../../domain/models/Role';

export interface UpdateRoleUseCase {
  update(role: Role): Promise<Role>;
}
