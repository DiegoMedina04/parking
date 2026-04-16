import { VehicleType } from '../../../../domain/models/VehicleType';

export interface UpdateVehicleTypeUseCase {
    update(vehicleType: VehicleType): Promise<VehicleType>;
}
