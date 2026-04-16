import { Vehicle } from '../../../../domain/models/Vehicle';

export interface UpdateVehicleUseCase {
    update(vehicle: Vehicle): Promise<Vehicle>;
}
