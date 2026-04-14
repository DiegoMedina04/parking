import { Parking } from '../../../domain/models/Parking';
import { UpdateParkingUseCase } from '../../../domain/ports/in/parking/UpdateParkingUseCase';
import { ParkingRepositoryPort } from '../../../domain/ports/out/ParkingRepositoryPort';

export class UpdateParkingUseCaseImpl implements UpdateParkingUseCase {
  constructor(private readonly parkingRepositoryPort: ParkingRepositoryPort) {}

  async update(parking: Parking): Promise<Parking> {
    return this.parkingRepositoryPort.update(parking);
  }
}
