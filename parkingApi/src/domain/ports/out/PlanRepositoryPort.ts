import { Plan } from '../../../domain/models/Plan';

export interface PlanRepositoryPort {
    findAll(): Promise<Plan[]>;
    findById(id: string): Promise<Plan | null>;
    save(plan: Plan): Promise<Plan>;
    update(plan: Plan): Promise<Plan>;
    delete(id: string): Promise<void>;
}
