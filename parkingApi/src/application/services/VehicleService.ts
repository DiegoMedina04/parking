import { Vehicle } from '../../domain/models/Vehicle';
import { CreateVehicleUseCase } from '../../domain/ports/in/vehicle/CreateVehicleUseCase';
import { RetrieveVehicleUseCase } from '../../domain/ports/in/vehicle/RetrieveVehicleUseCase';
import { UpdateVehicleUseCase } from '../../domain/ports/in/vehicle/UpdateVehicleUseCase';
import { DeleteVehicleUseCase } from '../../domain/ports/in/vehicle/DeleteVehicleUseCase';

export class VehicleService implements RetrieveVehicleUseCase, CreateVehicleUseCase, UpdateVehicleUseCase, DeleteVehicleUseCase {
  constructor(
    private readonly retrieveVehicleUseCase: RetrieveVehicleUseCase,
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase
  ) {}

  async getVehicles(parqueadero_id?: string): Promise<Vehicle[]> {
    return this.retrieveVehicleUseCase.getVehicles(parqueadero_id);
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.retrieveVehicleUseCase.findById(id);
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    return this.createVehicleUseCase.save(vehicle);
  }

  async update(vehicle: Vehicle): Promise<Vehicle> {
    return this.updateVehicleUseCase.update(vehicle);
  }

  async delete(id: string): Promise<void> {
    return this.deleteVehicleUseCase.delete(id);
  }
}
