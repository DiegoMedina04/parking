import { Plan } from '../../../domain/models/Plan';
import { RetrievePlanUseCase } from '../../../domain/ports/in/plan/RetrievePlanUseCase';
import { PlanRepositoryPort } from '../../../domain/ports/out/PlanRepositoryPort';

export class RetrievePlanUseCaseImpl implements RetrievePlanUseCase {
  constructor(private readonly planRepositoryPort: PlanRepositoryPort) {}

  async getPlans(): Promise<Plan[]> {
    return this.planRepositoryPort.findAll();
  }
}
