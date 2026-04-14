import { DeleteParkingUseCase } from '../../../domain/ports/in/parking/DeleteParkingUseCase';
import { ParkingRepositoryPort } from '../../../domain/ports/out/ParkingRepositoryPort';

export class DeleteParkingUseCaseImpl implements DeleteParkingUseCase {
  constructor(private readonly parkingRepositoryPort: ParkingRepositoryPort) {}

  async delete(id: string): Promise<void> {
    return this.parkingRepositoryPort.delete(id);
  }
}
