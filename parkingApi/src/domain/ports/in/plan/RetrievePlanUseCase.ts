import { Plan } from '../../../../domain/models/Plan';

export interface RetrievePlanUseCase {
    getPlans(): Promise<Plan[]>;
}
