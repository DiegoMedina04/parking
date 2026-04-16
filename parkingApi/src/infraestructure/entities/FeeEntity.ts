import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Fee } from '../../domain/models/Fee';
import { VehicleTypeEntity } from './VehicleTypeEntity';
import { ParkingEntity } from './ParkingEntity';

@Entity('fees')
export class FeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  nombre_tarifa!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  valor!: number;

  @Column({ type: 'int', nullable: false })
  tiempo_minutos!: number;

  @ManyToOne(() => VehicleTypeEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'tipo_vehiculo_id' })
  tipoVehiculo!: VehicleTypeEntity;

  @ManyToOne(() => ParkingEntity, { nullable: false })
  @JoinColumn({ name: 'parqueadero_id' })
  parqueadero!: ParkingEntity;

  @Column({ name: 'tipo_vehiculo_id', nullable: false })
  tipo_vehiculo_id!: string;

  @Column({ name: 'parqueadero_id', nullable: false })
  parqueadero_id!: string;

  static fromDomainModel(fee: Fee): FeeEntity {
    const entity = new FeeEntity();
    if (fee.id) entity.id = fee.id;
    entity.nombre_tarifa = fee.nombre_tarifa;
    entity.valor = fee.valor;
    entity.tiempo_minutos = fee.tiempo_minutos;
    entity.tipo_vehiculo_id = fee.tipo_vehiculo_id;
    entity.parqueadero_id = fee.parqueadero_id;
    return entity;
  }

  toDomainModel(): Fee {
    return new Fee(
      this.id,
      this.nombre_tarifa,
      Number(this.valor),
      this.tiempo_minutos,
      this.tipo_vehiculo_id,
      this.parqueadero_id
    );
  }
}
