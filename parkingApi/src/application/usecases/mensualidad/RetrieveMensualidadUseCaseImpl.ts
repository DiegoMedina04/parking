import { RetrieveMensualidadUseCase } from '../../../domain/ports/in/mensualidad/RetrieveMensualidadUseCase';
import { Mensualidad } from '../../../domain/models/Mensualidad';
import { MensualidadRepositoryPort } from '../../../domain/ports/out/MensualidadRepositoryPort';

export class RetrieveMensualidadUseCaseImpl implements RetrieveMensualidadUseCase {
    constructor(private readonly repository: MensualidadRepositoryPort) {}

    async findById(id: string): Promise<Mensualidad | null> {
        return this.repository.findById(id);
    }

    async findAll(): Promise<Mensualidad[]> {
        return this.repository.findAll();
    }

    async findByVehicleId(vehicleId: string): Promise<Mensualidad[]> {
        return this.repository.findByVehicleId(vehicleId);
    }
}
