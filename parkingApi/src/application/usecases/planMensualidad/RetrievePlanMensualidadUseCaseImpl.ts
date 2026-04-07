import { RetrievePlanMensualidadUseCase } from '../../../domain/ports/in/planMensualidad/RetrievePlanMensualidadUseCase';
import { PlanMensualidad } from '../../../domain/models/PlanMensualidad';
import { PlanMensualidadRepositoryPort } from '../../../domain/ports/out/PlanMensualidadRepositoryPort';

export class RetrievePlanMensualidadUseCaseImpl implements RetrievePlanMensualidadUseCase {
    constructor(private readonly repository: PlanMensualidadRepositoryPort) {}

    async findById(id: string): Promise<PlanMensualidad | null> {
        return this.repository.findById(id);
    }

    async findAll(): Promise<PlanMensualidad[]> {
        return this.repository.findAll();
    }
}
