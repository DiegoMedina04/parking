import { Parking } from '../../../domain/models/Parking';
import { CreateParkingUseCase } from '../../../domain/ports/in/parking/CreateParkingUseCase';
import { ParkingRepositoryPort } from '../../../domain/ports/out/ParkingRepositoryPort';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class CreateParkingUseCaseImpl implements CreateParkingUseCase {
  constructor(
    private readonly parkingRepositoryPort: ParkingRepositoryPort,
    private readonly userRepositoryPort: UserRepositoryPort
  ) {}

  async save(parking: Parking): Promise<Parking> {
    if (!parking.user || !parking.user.id) {
       throw new NotFoundError('User information is required to create a parking');
    }

    const userExists = await this.userRepositoryPort.findById(parking.user.id);
    if (!userExists) {
        throw new NotFoundError(`User with ID ${parking.user.id} does not exist`);
    }

    return this.parkingRepositoryPort.save(parking);
  }
}
