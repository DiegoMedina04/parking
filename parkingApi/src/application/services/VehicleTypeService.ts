import { VehicleType } from '../../domain/models/VehicleType';
import { CreateVehicleTypeUseCase } from '../../domain/ports/in/vehicleType/CreateVehicleTypeUseCase';
import { RetrieveVehicleTypeUseCase } from '../../domain/ports/in/vehicleType/RetrieveVehicleTypeUseCase';

export class VehicleTypeService implements RetrieveVehicleTypeUseCase, CreateVehicleTypeUseCase {
  constructor(
    private readonly retrieveVehicleTypeUseCase: RetrieveVehicleTypeUseCase,
    private readonly createVehicleTypeUseCase: CreateVehicleTypeUseCase
  ) {}

  async getVehicleTypes(): Promise<VehicleType[]> {
    return this.retrieveVehicleTypeUseCase.getVehicleTypes();
  }

  async findById(id: string): Promise<VehicleType | null> {
    return this.retrieveVehicleTypeUseCase.findById(id);
  }

  async save(vehicleType: VehicleType): Promise<VehicleType> {
    return this.createVehicleTypeUseCase.save(vehicleType);
  }
}
