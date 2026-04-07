import { Parking } from '../../domain/models/Parking';
import { CreateParkingUseCase } from '../../domain/ports/in/parking/CreateParkingUseCase';
import { RetrieveParkingUseCase } from '../../domain/ports/in/parking/RetrieveParkingUseCase';

export class ParkingService implements RetrieveParkingUseCase, CreateParkingUseCase {
  constructor(
    private readonly retrieveParkingUseCase: RetrieveParkingUseCase,
    private readonly createParkingUseCase: CreateParkingUseCase
  ) {}

  async getParkings(): Promise<Parking[]> {
    return this.retrieveParkingUseCase.getParkings();
  }

  async save(parking: Parking): Promise<Parking> {
    return this.createParkingUseCase.save(parking);
  }
}
