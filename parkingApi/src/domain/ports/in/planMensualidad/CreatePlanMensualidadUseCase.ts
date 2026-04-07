import { PlanMensualidad } from '../../../models/PlanMensualidad';

export interface CreatePlanMensualidadUseCase {
    save(plan: PlanMensualidad): Promise<PlanMensualidad>;
}
