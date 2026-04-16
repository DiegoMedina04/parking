import { VehicleType } from '../../../../domain/models/VehicleType';

export interface RetrieveVehicleTypeUseCase {
    getVehicleTypes(parqueadero_id?: string): Promise<VehicleType[]>;
    findById(id: string): Promise<VehicleType | null>;
}
