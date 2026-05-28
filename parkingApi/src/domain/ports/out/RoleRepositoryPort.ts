import { Role } from '../../../domain/models/Role';

export interface RoleRepositoryPort {
    findAll(): Promise<Role[]>;
    findById(id: string): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    save(role: Role): Promise<Role>;
    update(role: Role): Promise<Role>;
    delete(id: string): Promise<void>;
}
