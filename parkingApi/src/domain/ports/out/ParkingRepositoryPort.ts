import { Parking } from '../../../domain/models/Parking';

export interface ParkingRepositoryPort {
    findAll(): Promise<Parking[]>;
    findById(id: string): Promise<Parking | null>;
    findByUserId(userId: string): Promise<Parking[]>;
    save(parking: Parking): Promise<Parking>;
    update(parking: Parking): Promise<Parking>;
    delete(id: string): Promise<void>;
}
