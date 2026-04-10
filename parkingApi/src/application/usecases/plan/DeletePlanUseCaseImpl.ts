import { DeletePlanUseCase } from '../../../domain/ports/in/plan/DeletePlanUseCase';
import { PlanRepositoryPort } from '../../../domain/ports/out/PlanRepositoryPort';

export class DeletePlanUseCaseImpl implements DeletePlanUseCase {
  constructor(private readonly planRepositoryPort: PlanRepositoryPort) {}

  async delete(id: string): Promise<void> {
    return this.planRepositoryPort.delete(id);
  }
}
