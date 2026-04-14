import { Parking } from '../../../../domain/models/Parking';

export interface RetrieveParkingUseCase {
    getParkings(userId?: string): Promise<Parking[]>;
}
