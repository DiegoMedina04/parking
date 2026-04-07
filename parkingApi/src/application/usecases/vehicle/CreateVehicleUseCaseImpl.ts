import { Vehicle } from '../../../domain/models/Vehicle';
import { CreateVehicleUseCase } from '../../../domain/ports/in/vehicle/CreateVehicleUseCase';
import { VehicleRepositoryPort } from '../../../domain/ports/out/VehicleRepositoryPort';
import { VehicleTypeRepositoryPort } from '../../../domain/ports/out/VehicleTypeRepositoryPort';
import { ClientRepositoryPort } from '../../../domain/ports/out/ClientRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';
import { BadRequestError } from '../../../domain/exceptions/BadRequestError';

export class CreateVehicleUseCaseImpl implements CreateVehicleUseCase {
  constructor(
    private readonly vehicleRepositoryPort: VehicleRepositoryPort,
    private readonly vehicleTypeRepositoryPort: VehicleTypeRepositoryPort,
    private readonly clientRepositoryPort: ClientRepositoryPort
  ) {}

  async save(vehicle: Vehicle): Promise<Vehicle> {
    if (!vehicle.type || !vehicle.type.id) {
       throw new NotFoundError('Vehicle Type information is required to create a vehicle');
    }
    
    const typeExists = await this.vehicleTypeRepositoryPort.findById(vehicle.type.id);
    if (!typeExists) {
        throw new NotFoundError(`Vehicle Type with ID ${vehicle.type.id} does not exist`);
    }

    if (vehicle.client && vehicle.client.id) {
        const clientExists = await this.clientRepositoryPort.findById(vehicle.client.id);
        if (!clientExists) {
            throw new NotFoundError(`Client with ID ${vehicle.client.id} does not exist`);
        }
    }

    if (!vehicle.registrationDate) {
        vehicle.registrationDate = new Date();
    }
    
    const existingVehicle = await this.vehicleRepositoryPort.findByLicensePlate(vehicle.licensePlate);
    if (existingVehicle) {
        throw new BadRequestError(`Vehicle with license plate ${vehicle.licensePlate} already exists`);
    }
    
    return this.vehicleRepositoryPort.save(vehicle);
  }
}
