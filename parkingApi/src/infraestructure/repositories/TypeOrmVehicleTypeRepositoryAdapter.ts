import { Repository } from 'typeorm';
import { VehicleType } from '../../domain/models/VehicleType';
import { VehicleTypeRepositoryPort } from '../../domain/ports/out/VehicleTypeRepositoryPort';
import { VehicleTypeEntity } from '../entities/VehicleTypeEntity';

export class TypeOrmVehicleTypeRepositoryAdapter implements VehicleTypeRepositoryPort {
  constructor(private readonly vehicleTypeRepository: Repository<VehicleTypeEntity>) {}

  async findAll(parqueadero_id?: string): Promise<VehicleType[]> {
    const whereClause = parqueadero_id ? { parqueadero_id } : {};
    const entities = await this.vehicleTypeRepository.find({ where: whereClause });
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<VehicleType | null> {
    const entity = await this.vehicleTypeRepository.findOne({ where: { id } });
    return entity ? entity.toDomainModel() : null;
  }

  async findByName(name: string): Promise<VehicleType | null> {
    const entity = await this.vehicleTypeRepository.findOne({ where: { name_unique: name.toLowerCase() } });
    return entity ? entity.toDomainModel() : null;
  }

  async save(vehicleType: VehicleType): Promise<VehicleType> {
    const entity = VehicleTypeEntity.fromDomainModel(vehicleType);
    const savedEntity = await this.vehicleTypeRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(vehicleType: VehicleType): Promise<VehicleType> {
    const entity = VehicleTypeEntity.fromDomainModel(vehicleType);
    const savedEntity = await this.vehicleTypeRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.vehicleTypeRepository.delete(id);
  }
}
