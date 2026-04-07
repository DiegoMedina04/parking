import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../domain/models/Vehicle';
import { VehicleTypeEntity } from './VehicleTypeEntity';
import { ClientEntity } from './ClientEntity';
import { ParkingEntity } from './ParkingEntity';

@Entity('vehicles')
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: false })
  licensePlate!: string;

  @Column({ nullable: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationDate!: Date;

  @ManyToOne(() => VehicleTypeEntity, { nullable: false })
  @JoinColumn({ name: 'vehicle_type_id' })
  type!: VehicleTypeEntity;

  @ManyToOne(() => ClientEntity, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client?: ClientEntity;

  @ManyToOne(() => ParkingEntity, { nullable: false })
  @JoinColumn({ name: 'parking_id' })
  parking!: ParkingEntity;

  static fromDomainModel(vehicle: Vehicle): VehicleEntity {
    const entity = new VehicleEntity();
    if (vehicle.id) entity.id = vehicle.id;
    entity.licensePlate = vehicle.licensePlate;
    entity.registrationDate = vehicle.registrationDate;

    if (vehicle.type) {
      entity.type = VehicleTypeEntity.fromDomainModel(vehicle.type);
    }
    if (vehicle.client) {
      entity.client = ClientEntity.fromDomainModel(vehicle.client);
    }
    if (vehicle.parking) {
      entity.parking = ParkingEntity.fromDomainModel(vehicle.parking);
    }

    return entity;
  }

  toDomainModel(): Vehicle {
    return new Vehicle(
      this.id,
      this.licensePlate,
      this.registrationDate,
      this.type?.toDomainModel(),
      this.client?.toDomainModel(),
      this.parking?.toDomainModel()
    );
  }
}
