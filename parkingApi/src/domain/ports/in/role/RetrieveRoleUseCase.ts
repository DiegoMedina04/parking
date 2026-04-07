import { Role } from '../../../../domain/models/Role';

export interface RetrieveRoleUseCase {
    getRoles(): Promise<Role[]>;
}
