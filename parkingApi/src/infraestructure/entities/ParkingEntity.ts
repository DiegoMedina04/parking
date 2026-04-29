import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Parking } from '../../domain/models/Parking';
import { UserEntity } from './UserEntity';
import { SubscriptionEntity } from './SubscriptionEntity';

@Entity('parqueaderos')
export class ParkingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  address!: string;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.parking, { cascade: true })
  subscription?: SubscriptionEntity[];

  @ManyToOne(() => UserEntity, (user) => user.parking)
  user!: UserEntity;

  static fromDomainModel(parking: Parking): ParkingEntity {
    const entity = new ParkingEntity();
    entity.id = parking.id;
    entity.name = parking.name;
    entity.address = parking.address;

    if (parking.user) {
      entity.user = UserEntity.fromDomainModel(parking.user);
    }

    return entity;
  }

  toDomainModel(): Parking {
    const parkingDomain = new Parking(
      this.id,
      this.name,
      this.address,
      [], // Initialized empty
      this.user?.toDomainModel()
    );

    if (this.subscription) {
      (parkingDomain as any).subscription = this.subscription.map(s => 
        s.toDomainModel(parkingDomain)
      );
    }

    return parkingDomain;
  }
}
