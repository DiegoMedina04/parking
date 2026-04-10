import { Plan } from '../../domain/models/Plan';
import { CreatePlanUseCase } from '../../domain/ports/in/plan/CreatePlanUseCase';
import { RetrievePlanUseCase } from '../../domain/ports/in/plan/RetrievePlanUseCase';
import { UpdatePlanUseCase } from '../../domain/ports/in/plan/UpdatePlanUseCase';
import { DeletePlanUseCase } from '../../domain/ports/in/plan/DeletePlanUseCase';

export class PlanService implements RetrievePlanUseCase, CreatePlanUseCase, UpdatePlanUseCase, DeletePlanUseCase {
  constructor(
    private readonly retrievePlanUseCase: RetrievePlanUseCase,
    private readonly createPlanUseCase: CreatePlanUseCase,
    private readonly updatePlanUseCase: UpdatePlanUseCase,
    private readonly deletePlanUseCase: DeletePlanUseCase
  ) {}

  async getPlans(): Promise<Plan[]> {
    return this.retrievePlanUseCase.getPlans();
  }

  async save(plan: Plan): Promise<Plan> {
    return this.createPlanUseCase.save(plan);
  }

  async update(plan: Plan): Promise<Plan> {
    return this.updatePlanUseCase.update(plan);
  }

  async delete(id: string): Promise<void> {
    return this.deletePlanUseCase.delete(id);
  }
}
