import { Plan } from '../../domain/models/Plan';
import { CreatePlanUseCase } from '../../domain/ports/in/plan/CreatePlanUseCase';
import { RetrievePlanUseCase } from '../../domain/ports/in/plan/RetrievePlanUseCase';

export class PlanService implements RetrievePlanUseCase, CreatePlanUseCase {
  constructor(
    private readonly retrievePlanUseCase: RetrievePlanUseCase,
    private readonly createPlanUseCase: CreatePlanUseCase
  ) {}

  async getPlans(): Promise<Plan[]> {
    return this.retrievePlanUseCase.getPlans();
  }

  async save(plan: Plan): Promise<Plan> {
    return this.createPlanUseCase.save(plan);
  }
}
