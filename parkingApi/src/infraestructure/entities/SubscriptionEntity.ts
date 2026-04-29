import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Subscription } from '../../domain/models/Subscription';
import { SubscriptionStatus } from '../../domain/models/SubscriptionStatus';
import { ParkingEntity } from './ParkingEntity';
import { PlanEntity } from './PlanEntity';
import { Parking } from '../../domain/models/Parking';

@Entity('suscripciones')
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ParkingEntity, (parking) => parking.subscription)
  @JoinColumn({ name: 'parking_id' })
  parking!: ParkingEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.subscription)
  @JoinColumn({ name: 'plan_id' })
  plan!: PlanEntity;

  @Column({ name: 'fecha_inicio', nullable: false })
  startDate!: Date;

  @Column({ name: 'fecha_fin', nullable: true })
  endDate!: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    name: 'estado',
    nullable: false,
  })
  status!: SubscriptionStatus;

  static fromDomainModel(subscription: Subscription): SubscriptionEntity {
    const entity = new SubscriptionEntity();
    entity.id = subscription.id;
    entity.parking = ParkingEntity.fromDomainModel(subscription.parking);
    entity.plan = PlanEntity.fromDomainModel(subscription.plan);
    entity.startDate = subscription.startDate;
    entity.endDate = subscription.endDate;
    entity.status = subscription.status;
    return entity;
  }

  toDomainModel(parkingModel?: Parking): Subscription {
    return new Subscription(
      this.id,
      parkingModel || (this.parking ? this.parking.toDomainModel() : null as any),
      this.plan ? this.plan.toDomainModel() : null as any,
      this.startDate,
      this.endDate,
      this.status
    );
  }
}
