import { VehicleType } from '../../models/VehicleType';

export interface VehicleTypeRepositoryPort {
    findAll(parqueadero_id?: string): Promise<VehicleType[]>;
    findById(id: string): Promise<VehicleType | null>;
    save(vehicleType: VehicleType): Promise<VehicleType>;
    update(vehicleType: VehicleType): Promise<VehicleType>;
    delete(id: string): Promise<void>;
}
