import { VehicleType } from '../../../../domain/models/VehicleType';

export interface CreateVehicleTypeUseCase {
    save(vehicleType: VehicleType): Promise<VehicleType>;
}
