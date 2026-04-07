import { VehicleType } from '../../../../domain/models/VehicleType';

export interface RetrieveVehicleTypeUseCase {
    getVehicleTypes(): Promise<VehicleType[]>;
    findById(id: string): Promise<VehicleType | null>;
}
