import { Vehicle } from '../../../domain/models/Vehicle';
import { UpdateVehicleUseCase } from '../../../domain/ports/in/vehicle/UpdateVehicleUseCase';
import { VehicleRepositoryPort } from '../../../domain/ports/out/VehicleRepositoryPort';
import { VehicleTypeRepositoryPort } from '../../../domain/ports/out/VehicleTypeRepositoryPort';
import { ClientRepositoryPort } from '../../../domain/ports/out/ClientRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';
import { BadRequestError } from '../../../domain/exceptions/BadRequestError';

export class UpdateVehicleUseCaseImpl implements UpdateVehicleUseCase {
  constructor(
    private readonly vehicleRepositoryPort: VehicleRepositoryPort,
    private readonly vehicleTypeRepositoryPort: VehicleTypeRepositoryPort,
    private readonly clientRepositoryPort: ClientRepositoryPort
  ) {}

  async update(vehicle: Vehicle): Promise<Vehicle> {
    if (!vehicle.id) {
       throw new BadRequestError('Vehicle ID is required for update');
    }

    const existingVehicle = await this.vehicleRepositoryPort.findById(vehicle.id);
    if (!existingVehicle) {
       throw new NotFoundError('Vehicle not found');
    }

    if (vehicle.licensePlate !== existingVehicle.licensePlate) {
       const plateCollission = await this.vehicleRepositoryPort.findByLicensePlate(vehicle.licensePlate);
       if (plateCollission && plateCollission.id !== vehicle.id) {
           throw new BadRequestError(`El vehículo con placa ${vehicle.licensePlate} ya existe`);
       }
    }

    if (vehicle.type?.id && vehicle.type.id !== existingVehicle.type?.id) {
        const typeExists = await this.vehicleTypeRepositoryPort.findById(vehicle.type.id);
        if (!typeExists) {
            throw new NotFoundError(`El Tipo de Vehículo no existe`);
        }
    }

    if (vehicle.client?.id && vehicle.client.id !== existingVehicle.client?.id) {
        const clientExists = await this.clientRepositoryPort.findById(vehicle.client.id);
        if (!clientExists) {
            throw new NotFoundError(`El Cliente no existe`);
        }
    }
    
    vehicle.registrationDate = existingVehicle.registrationDate;

    return this.vehicleRepositoryPort.update(vehicle);
  }
}
