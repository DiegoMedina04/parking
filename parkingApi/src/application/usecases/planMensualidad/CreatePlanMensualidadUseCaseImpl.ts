import { CreatePlanMensualidadUseCase } from '../../../domain/ports/in/planMensualidad/CreatePlanMensualidadUseCase';
import { PlanMensualidad } from '../../../domain/models/PlanMensualidad';
import { PlanMensualidadRepositoryPort } from '../../../domain/ports/out/PlanMensualidadRepositoryPort';

export class CreatePlanMensualidadUseCaseImpl implements CreatePlanMensualidadUseCase {
    constructor(private readonly repository: PlanMensualidadRepositoryPort) {}

    async save(planData: any): Promise<PlanMensualidad> {
        const plan = new PlanMensualidad(
            planData.id || '',
            planData.nombre,
            planData.duracion,
            planData.valor,
            planData.parqueadero_id,
            planData.tipo_vehiculo_id
        );
        return this.repository.save(plan);
    }
}
