import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Client } from '../../domain/models/Client';

@Entity('clients')
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  document!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  phone!: string;

  static fromDomainModel(client: Client): ClientEntity {
    const entity = new ClientEntity();
    if (client.id) entity.id = client.id;
    entity.name = client.name;
    entity.document = client.document;
    entity.email = client.email;
    entity.phone = client.phone;
    return entity;
  }

  toDomainModel(): Client {
    return new Client(
      this.id,
      this.name,
      this.document,
      this.email,
      this.phone
    );
  }
}
