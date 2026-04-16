import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { VehicleType } from '../../domain/models/VehicleType';

@Entity('vehicle_types')
@Unique(['name_unique', 'parqueadero_id'])
export class VehicleTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  name_unique!: string; // Using a unique name field to prevent duplicates

  @Column({ nullable: false })
  parqueadero_id!: string;

  static fromDomainModel(vehicleType: VehicleType): VehicleTypeEntity {
    const entity = new VehicleTypeEntity();
    if (vehicleType.id) entity.id = vehicleType.id;
    entity.name = vehicleType.name;
    entity.name_unique = vehicleType?.name?.toLowerCase();
    entity.parqueadero_id = vehicleType.parqueadero_id;
    return entity;
  }

  toDomainModel(): VehicleType {
    return new VehicleType(
      this.id,
      this.name,
      this.parqueadero_id
    );
  }
}
