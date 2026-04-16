import { VehicleType } from '../../../domain/models/VehicleType';
import { UpdateVehicleTypeUseCase } from '../../../domain/ports/in/vehicleType/UpdateVehicleTypeUseCase';
import { VehicleTypeRepositoryPort } from '../../../domain/ports/out/VehicleTypeRepositoryPort';

export class UpdateVehicleTypeUseCaseImpl implements UpdateVehicleTypeUseCase {
  constructor(private readonly vehicleTypeRepositoryPort: VehicleTypeRepositoryPort) {}

  async update(vehicleType: VehicleType): Promise<VehicleType> {
    return this.vehicleTypeRepositoryPort.update(vehicleType);
  }
}
