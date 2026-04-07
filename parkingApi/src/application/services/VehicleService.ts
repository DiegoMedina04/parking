import { Vehicle } from '../../domain/models/Vehicle';
import { CreateVehicleUseCase } from '../../domain/ports/in/vehicle/CreateVehicleUseCase';
import { RetrieveVehicleUseCase } from '../../domain/ports/in/vehicle/RetrieveVehicleUseCase';

export class VehicleService implements RetrieveVehicleUseCase, CreateVehicleUseCase {
  constructor(
    private readonly retrieveVehicleUseCase: RetrieveVehicleUseCase,
    private readonly createVehicleUseCase: CreateVehicleUseCase
  ) {}

  async getVehicles(): Promise<Vehicle[]> {
    return this.retrieveVehicleUseCase.getVehicles();
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.retrieveVehicleUseCase.findById(id);
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    return this.createVehicleUseCase.save(vehicle);
  }
}
