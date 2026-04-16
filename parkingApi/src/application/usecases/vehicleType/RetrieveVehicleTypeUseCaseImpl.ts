import { VehicleType } from '../../../domain/models/VehicleType';
import { RetrieveVehicleTypeUseCase } from '../../../domain/ports/in/vehicleType/RetrieveVehicleTypeUseCase';
import { VehicleTypeRepositoryPort } from '../../../domain/ports/out/VehicleTypeRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class RetrieveVehicleTypeUseCaseImpl implements RetrieveVehicleTypeUseCase {
  constructor(private readonly vehicleTypeRepositoryPort: VehicleTypeRepositoryPort) {}

  async getVehicleTypes(parqueadero_id?: string): Promise<VehicleType[]> {
    return this.vehicleTypeRepositoryPort.findAll(parqueadero_id);
  }

  async findById(id: string): Promise<VehicleType | null> {
    const vehicleType = await this.vehicleTypeRepositoryPort.findById(id);
    if (!vehicleType) {
      throw new NotFoundError('Vehicle type not found');
    }
    return vehicleType;
  }
}
