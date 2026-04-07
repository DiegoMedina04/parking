import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../domain/models/User';
import { RoleEntity } from './RoleEntity';
import { ParkingEntity } from './ParkingEntity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false, length: 20 })
  document!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;

  @OneToMany(() => ParkingEntity, (parking) => parking.user, { cascade: true })
  parking?: ParkingEntity[];

  static fromDomainModel(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.document = user.document;
    entity.password = user.password || '';
    entity.email = user.email || '';
    
    if (user.role) {
      entity.role = RoleEntity.fromDomainModel(user.role);
    }
    
    if (user.parking) {
      entity.parking = user.parking.map(ParkingEntity.fromDomainModel);
    }
    
    return entity;
  }

  toDomainModel(): User {
    return new User(
      this.id,
      this.name,
      this.document,
      this.password,
      this.email,
      this.role?.toDomainModel(),
      undefined // Avoid circular reference or load if needed
    );
  }
}
