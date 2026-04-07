import { Repository } from 'typeorm';
import { Vehicle } from '../../domain/models/Vehicle';
import { VehicleRepositoryPort } from '../../domain/ports/out/VehicleRepositoryPort';
import { VehicleEntity } from '../entities/VehicleEntity';

export class TypeOrmVehicleRepositoryAdapter implements VehicleRepositoryPort {
  constructor(private readonly vehicleRepository: Repository<VehicleEntity>) {}

  async findAll(): Promise<Vehicle[]> {
    const entities = await this.vehicleRepository.find({ relations: ['type', 'client', 'parking'] });
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<Vehicle | null> {
    const entity = await this.vehicleRepository.findOne({ 
      where: { id }, 
      relations: ['type', 'client', 'parking'] 
    });
    return entity ? entity.toDomainModel() : null;
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    const entity = await this.vehicleRepository.findOne({ where: { licensePlate } });
    return entity ? entity.toDomainModel() : null;
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    const entity = VehicleEntity.fromDomainModel(vehicle);
    const savedEntity = await this.vehicleRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(vehicle: Vehicle): Promise<Vehicle> {
    const entity = VehicleEntity.fromDomainModel(vehicle);
    const savedEntity = await this.vehicleRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
