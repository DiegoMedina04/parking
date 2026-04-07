import { Parking } from '../../../domain/models/Parking';
import { RetrieveParkingUseCase } from '../../../domain/ports/in/parking/RetrieveParkingUseCase';
import { ParkingRepositoryPort } from '../../../domain/ports/out/ParkingRepositoryPort';

export class RetrieveParkingUseCaseImpl implements RetrieveParkingUseCase {
  constructor(private readonly parkingRepositoryPort: ParkingRepositoryPort) {}

  async getParkings(): Promise<Parking[]> {
    return this.parkingRepositoryPort.findAll();
  }
}
