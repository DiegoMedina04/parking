import { DeleteVehicleUseCase } from '../../../domain/ports/in/vehicle/DeleteVehicleUseCase';
import { VehicleRepositoryPort } from '../../../domain/ports/out/VehicleRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';
import { BadRequestError } from '../../../domain/exceptions/BadRequestError';

export class DeleteVehicleUseCaseImpl implements DeleteVehicleUseCase {
  constructor(private readonly vehicleRepositoryPort: VehicleRepositoryPort) {}

  async delete(id: string): Promise<void> {
    const vehicle = await this.vehicleRepositoryPort.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }
    
    try {
      await this.vehicleRepositoryPort.delete(id);
    } catch (error: any) {
      if (error.code === '23503' || error.errno === 1451 || error.message?.toLowerCase().includes('foreign key') || error.message?.toLowerCase().includes('constraint')) {
        throw new BadRequestError('El vehículo tiene tickets o deudas pendientes y no puede ser eliminado.');
      }
      throw error;
    }
  }
}
