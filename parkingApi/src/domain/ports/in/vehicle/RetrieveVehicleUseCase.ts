import { Vehicle } from '../../../../domain/models/Vehicle';

export interface RetrieveVehicleUseCase {
    getVehicles(parqueadero_id?: string): Promise<Vehicle[]>;
    findById(id: string): Promise<Vehicle | null>;
}
