import { Plan } from '../../../../domain/models/Plan';

export interface UpdatePlanUseCase {
  update(plan: Plan): Promise<Plan>;
}
