import { Plan } from '../../../domain/models/Plan';
import { UpdatePlanUseCase } from '../../../domain/ports/in/plan/UpdatePlanUseCase';
import { PlanRepositoryPort } from '../../../domain/ports/out/PlanRepositoryPort';

export class UpdatePlanUseCaseImpl implements UpdatePlanUseCase {
  constructor(private readonly planRepositoryPort: PlanRepositoryPort) {}

  async update(plan: Plan): Promise<Plan> {
    return this.planRepositoryPort.update(plan);
  }
}
