import { VehicleType } from '../../../domain/models/VehicleType';
import { CreateVehicleTypeUseCase } from '../../../domain/ports/in/vehicleType/CreateVehicleTypeUseCase';
import { VehicleTypeRepositoryPort } from '../../../domain/ports/out/VehicleTypeRepositoryPort';

export class CreateVehicleTypeUseCaseImpl implements CreateVehicleTypeUseCase {
  constructor(private readonly vehicleTypeRepositoryPort: VehicleTypeRepositoryPort) {}

  async save(vehicleType: VehicleType): Promise<VehicleType> {
    return this.vehicleTypeRepositoryPort.save(vehicleType);
  }
}
