import { VehicleType } from '../../domain/models/VehicleType';
import { CreateVehicleTypeUseCase } from '../../domain/ports/in/vehicleType/CreateVehicleTypeUseCase';
import { RetrieveVehicleTypeUseCase } from '../../domain/ports/in/vehicleType/RetrieveVehicleTypeUseCase';
import { UpdateVehicleTypeUseCase } from '../../domain/ports/in/vehicleType/UpdateVehicleTypeUseCase';
import { DeleteVehicleTypeUseCase } from '../../domain/ports/in/vehicleType/DeleteVehicleTypeUseCase';

export class VehicleTypeService implements RetrieveVehicleTypeUseCase, CreateVehicleTypeUseCase, UpdateVehicleTypeUseCase, DeleteVehicleTypeUseCase {
  constructor(
    private readonly retrieveVehicleTypeUseCase: RetrieveVehicleTypeUseCase,
    private readonly createVehicleTypeUseCase: CreateVehicleTypeUseCase,
    private readonly updateVehicleTypeUseCase: UpdateVehicleTypeUseCase,
    private readonly deleteVehicleTypeUseCase: DeleteVehicleTypeUseCase
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

  async update(vehicleType: VehicleType): Promise<VehicleType> {
    return this.updateVehicleTypeUseCase.update(vehicleType);
  }

  async delete(id: string): Promise<void> {
    return this.deleteVehicleTypeUseCase.delete(id);
  }
}
