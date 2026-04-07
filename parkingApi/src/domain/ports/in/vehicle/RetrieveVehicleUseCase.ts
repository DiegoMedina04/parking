import { Vehicle } from '../../../../domain/models/Vehicle';

export interface RetrieveVehicleUseCase {
    getVehicles(): Promise<Vehicle[]>;
    findById(id: string): Promise<Vehicle | null>;
}
