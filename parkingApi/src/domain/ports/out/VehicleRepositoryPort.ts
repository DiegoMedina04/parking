import { Vehicle } from '../../models/Vehicle';

export interface VehicleRepositoryPort {
    findAll(parqueadero_id?: string): Promise<Vehicle[]>;
    findById(id: string): Promise<Vehicle | null>;
    findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
    save(vehicle: Vehicle): Promise<Vehicle>;
    update(vehicle: Vehicle): Promise<Vehicle>;
    delete(id: string): Promise<void>;
}
