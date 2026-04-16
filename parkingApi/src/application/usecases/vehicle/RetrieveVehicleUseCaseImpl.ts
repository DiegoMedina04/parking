import { Vehicle } from '../../../domain/models/Vehicle';
import { RetrieveVehicleUseCase } from '../../../domain/ports/in/vehicle/RetrieveVehicleUseCase';
import { VehicleRepositoryPort } from '../../../domain/ports/out/VehicleRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class RetrieveVehicleUseCaseImpl implements RetrieveVehicleUseCase {
  constructor(private readonly vehicleRepositoryPort: VehicleRepositoryPort) {}

  async getVehicles(parqueadero_id?: string): Promise<Vehicle[]> {
    return this.vehicleRepositoryPort.findAll(parqueadero_id);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.vehicleRepositoryPort.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }
    return vehicle;
  }
}
