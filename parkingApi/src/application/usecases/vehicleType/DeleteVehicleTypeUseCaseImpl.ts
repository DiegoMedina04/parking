import { DeleteVehicleTypeUseCase } from '../../../domain/ports/in/vehicleType/DeleteVehicleTypeUseCase';
import { VehicleTypeRepositoryPort } from '../../../domain/ports/out/VehicleTypeRepositoryPort';

export class DeleteVehicleTypeUseCaseImpl implements DeleteVehicleTypeUseCase {
  constructor(private readonly vehicleTypeRepositoryPort: VehicleTypeRepositoryPort) {}

  async delete(id: string): Promise<void> {
    return this.vehicleTypeRepositoryPort.delete(id);
  }
}
