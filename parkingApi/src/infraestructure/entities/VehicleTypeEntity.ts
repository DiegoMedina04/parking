import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { VehicleType } from '../../domain/models/VehicleType';

@Entity('vehicle_types')
export class VehicleTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  name_unique!: string; // Using a unique name field to prevent duplicates

  static fromDomainModel(vehicleType: VehicleType): VehicleTypeEntity {
    const entity = new VehicleTypeEntity();
    if (vehicleType.id) entity.id = vehicleType.id;
    entity.name = vehicleType.name;
    entity.name_unique = vehicleType?.name?.toLowerCase();
    return entity;
  }

  toDomainModel(): VehicleType {
    return new VehicleType(
      this.id,
      this.name
    );
  }
}
