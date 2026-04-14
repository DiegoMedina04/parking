import { Parking } from '../../../../domain/models/Parking';

export interface UpdateParkingUseCase {
    update(parking: Parking): Promise<Parking>;
}
