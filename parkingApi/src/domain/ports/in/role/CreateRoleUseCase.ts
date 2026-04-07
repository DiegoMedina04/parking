import { Role } from '../../../../domain/models/Role';

export interface CreateRoleUseCase {
    save(role: Role): Promise<Role>;
}
