import { Repository } from 'typeorm';
import { Parking } from '../../domain/models/Parking';
import { ParkingRepositoryPort } from '../../domain/ports/out/ParkingRepositoryPort';
import { ParkingEntity } from '../entities/ParkingEntity';

export class TypeOrmParkingRepositoryAdapter implements ParkingRepositoryPort {
  constructor(private readonly parkingRepository: Repository<ParkingEntity>) {}

  async findAll(): Promise<Parking[]> {
    const entities = await this.parkingRepository.find({ relations: ['user', 'subscription'] });
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<Parking | null> {
    const entity = await this.parkingRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'subscription'] 
    });
    return entity ? entity.toDomainModel() : null;
  }

  async save(parking: Parking): Promise<Parking> {
    const entity = ParkingEntity.fromDomainModel(parking);
    const savedEntity = await this.parkingRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(parking: Parking): Promise<Parking> {
    const entity = ParkingEntity.fromDomainModel(parking);
    const savedEntity = await this.parkingRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.parkingRepository.delete(id);
  }
}
