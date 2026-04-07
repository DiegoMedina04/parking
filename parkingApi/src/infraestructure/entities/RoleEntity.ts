import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../../domain/models/Role';
import { UserEntity } from './UserEntity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: false })
  name!: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users?: UserEntity[];

  static fromDomainModel(role: Role): RoleEntity {
    const entity = new RoleEntity();
    entity.id = role.id;
    entity.name = role.name;
    return entity;
  }

  toDomainModel(): Role {
    return new Role(this.id, this.name);
  }
}
