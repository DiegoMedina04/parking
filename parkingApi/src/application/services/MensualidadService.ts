import { Mensualidad } from '../../domain/models/Mensualidad';
import { CreateMensualidadUseCase } from '../../domain/ports/in/mensualidad/CreateMensualidadUseCase';
import { RetrieveMensualidadUseCase } from '../../domain/ports/in/mensualidad/RetrieveMensualidadUseCase';

export class MensualidadService {
    constructor(
        private readonly createUseCase: CreateMensualidadUseCase,
        private readonly retrieveUseCase: RetrieveMensualidadUseCase
    ) {}

    async save(mensualidad: Mensualidad): Promise<Mensualidad> {
        return this.createUseCase.save(mensualidad);
    }

    async findById(id: string): Promise<Mensualidad | null> {
        return this.retrieveUseCase.findById(id);
    }

    async findAll(): Promise<Mensualidad[]> {
        return this.retrieveUseCase.findAll();
    }

    async findByVehicleId(vehicleId: string): Promise<Mensualidad[]> {
        return this.retrieveUseCase.findByVehicleId(vehicleId);
    }
}
