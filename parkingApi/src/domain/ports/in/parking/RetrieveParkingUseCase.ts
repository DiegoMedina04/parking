import { Parking } from '../../../../domain/models/Parking';

export interface RetrieveParkingUseCase {
    getParkings(): Promise<Parking[]>;
}
