import { Plan } from '../../../domain/models/Plan';
import { CreatePlanUseCase } from '../../../domain/ports/in/plan/CreatePlanUseCase';
import { PlanRepositoryPort } from '../../../domain/ports/out/PlanRepositoryPort';

export class CreatePlanUseCaseImpl implements CreatePlanUseCase {
  constructor(private readonly planRepositoryPort: PlanRepositoryPort) {}

  async save(plan: Plan): Promise<Plan> {
    return this.planRepositoryPort.save(plan);
  }
}
