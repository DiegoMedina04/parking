import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Plan } from '../../domain/models/Plan';
import { SubscriptionEntity } from './SubscriptionEntity';

@Entity('planes')
export class PlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ type: 'int', nullable: false })
  maxPlaces!: number;

  @Column({ type: 'decimal', nullable: false })
  monthlyValue!: number;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.plan, { cascade: true })
  subscription?: SubscriptionEntity[];

  static fromDomainModel(plan: Plan): PlanEntity {
    const entity = new PlanEntity();
    entity.id = plan.id;
    entity.name = plan.name;
    entity.maxPlaces = plan.maxPlaces;
    entity.monthlyValue = plan.monthlyValue;
    return entity;
  }

  toDomainModel(): Plan {
    return new Plan(
      this.id,
      this.name,
      this.maxPlaces,
      this.monthlyValue,
      undefined // subscriptions
    );
  }
}
