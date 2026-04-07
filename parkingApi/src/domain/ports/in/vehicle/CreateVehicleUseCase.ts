import { Vehicle } from '../../../../domain/models/Vehicle';

export interface CreateVehicleUseCase {
    save(vehicle: Vehicle): Promise<Vehicle>;
}
