import { Repository } from 'typeorm';
import { Fee } from '../../domain/models/Fee';
import { FeeRepositoryPort } from '../../domain/ports/out/FeeRepositoryPort';
import { FeeEntity } from '../entities/FeeEntity';

export class TypeOrmFeeRepositoryAdapter implements FeeRepositoryPort {
  constructor(private readonly feeRepository: Repository<FeeEntity>) {}

  async findAll(parqueadero_id?: string): Promise<Fee[]> {
    const whereClause = parqueadero_id ? { parqueadero_id } : {};
    const entities = await this.feeRepository.find({ 
      where: whereClause,
      relations: ['tipoVehiculo']
    });
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<Fee | null> {
    const entity = await this.feeRepository.findOne({ 
      where: { id },
      relations: ['tipoVehiculo']
    });
    return entity ? entity.toDomainModel() : null;
  }

  async findDuplicate(
    nombre_tarifa: string,
    tiempo_minutos: number,
    tipo_vehiculo_id: string,
    parqueadero_id: string,
    excludeId?: string
  ): Promise<Fee | null> {
    const query = this.feeRepository.createQueryBuilder('fee')
      .where('fee.nombre_tarifa = :nombre', { nombre: nombre_tarifa })
      .andWhere('fee.tiempo_minutos = :tiempo', { tiempo: tiempo_minutos })
      .andWhere('fee.tipo_vehiculo_id = :tipo', { tipo: tipo_vehiculo_id })
      .andWhere('fee.parqueadero_id = :parq', { parq: parqueadero_id });

    if (excludeId) {
      query.andWhere('fee.id != :id', { id: excludeId });
    }

    const entity = await query.getOne();
    return entity ? entity.toDomainModel() : null;
  }

  async save(fee: Fee): Promise<Fee> {
    const entity = FeeEntity.fromDomainModel(fee);
    const savedEntity = await this.feeRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(fee: Fee): Promise<Fee> {
    const entity = FeeEntity.fromDomainModel(fee);
    const savedEntity = await this.feeRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.feeRepository.delete(id);
  }
}
