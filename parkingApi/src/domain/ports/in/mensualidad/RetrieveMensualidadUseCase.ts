import { Mensualidad } from '../../../models/Mensualidad';

export interface RetrieveMensualidadUseCase {
    findById(id: string): Promise<Mensualidad | null>;
    findAll(): Promise<Mensualidad[]>;
    findByVehicleId(vehicleId: string): Promise<Mensualidad[]>;
}
