import { PlanMensualidad } from '../../domain/models/PlanMensualidad';
import { CreatePlanMensualidadUseCase } from '../../domain/ports/in/planMensualidad/CreatePlanMensualidadUseCase';
import { RetrievePlanMensualidadUseCase } from '../../domain/ports/in/planMensualidad/RetrievePlanMensualidadUseCase';

export class PlanMensualidadService {
    constructor(
        private readonly createUseCase: CreatePlanMensualidadUseCase,
        private readonly retrieveUseCase: RetrievePlanMensualidadUseCase
    ) {}

    async save(plan: PlanMensualidad): Promise<PlanMensualidad> {
        return this.createUseCase.save(plan);
    }

    async findById(id: string): Promise<PlanMensualidad | null> {
        return this.retrieveUseCase.findById(id);
    }

    async findAll(): Promise<PlanMensualidad[]> {
        return this.retrieveUseCase.findAll();
    }
}
