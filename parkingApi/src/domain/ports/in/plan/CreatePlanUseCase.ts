import { Plan } from '../../../../domain/models/Plan';

export interface CreatePlanUseCase {
    save(plan: Plan): Promise<Plan>;
}
