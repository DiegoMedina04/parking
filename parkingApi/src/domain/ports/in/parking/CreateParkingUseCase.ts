import { Parking } from '../../../../domain/models/Parking';

export interface CreateParkingUseCase {
    save(parking: Parking): Promise<Parking>;
}
