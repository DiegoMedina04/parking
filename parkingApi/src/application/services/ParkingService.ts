import { Parking } from '../../domain/models/Parking';
import { CreateParkingUseCase } from '../../domain/ports/in/parking/CreateParkingUseCase';
import { RetrieveParkingUseCase } from '../../domain/ports/in/parking/RetrieveParkingUseCase';
import { UpdateParkingUseCase } from '../../domain/ports/in/parking/UpdateParkingUseCase';
import { DeleteParkingUseCase } from '../../domain/ports/in/parking/DeleteParkingUseCase';

export class ParkingService implements RetrieveParkingUseCase, CreateParkingUseCase, UpdateParkingUseCase, DeleteParkingUseCase {
  constructor(
    private readonly retrieveParkingUseCase: RetrieveParkingUseCase,
    private readonly createParkingUseCase: CreateParkingUseCase,
    private readonly updateParkingUseCase: UpdateParkingUseCase,
    private readonly deleteParkingUseCase: DeleteParkingUseCase
  ) {}

  async getParkings(userId?: string): Promise<Parking[]> {
    return this.retrieveParkingUseCase.getParkings(userId);
  }

  async save(parking: Parking): Promise<Parking> {
    return this.createParkingUseCase.save(parking);
  }

  async update(parking: Parking): Promise<Parking> {
    return this.updateParkingUseCase.update(parking);
  }

  async delete(id: string): Promise<void> {
    return this.deleteParkingUseCase.delete(id);
  }
}
