import { Repository } from 'typeorm';
import { Client } from '../../domain/models/Client';
import { ClientRepositoryPort } from '../../domain/ports/out/ClientRepositoryPort';
import { ClientEntity } from '../entities/ClientEntity';

export class TypeOrmClientRepositoryAdapter implements ClientRepositoryPort {
  constructor(private readonly clientRepository: Repository<ClientEntity>) {}

  async findAll(parqueadero_id?: string): Promise<Client[]> {
    const whereClause = parqueadero_id ? { parqueadero_id } : {};
    const entities = await this.clientRepository.find({ where: whereClause });
    return entities.map((entity) => entity.toDomainModel());
  }

  async findById(id: string): Promise<Client | null> {
    const entity = await this.clientRepository.findOne({ where: { id } });
    return entity ? entity.toDomainModel() : null;
  }

  async findByDocument(document: string): Promise<Client | null> {
    const entity = await this.clientRepository.findOne({ where: { document } });
    return entity ? entity.toDomainModel() : null;
  }

  async save(client: Client): Promise<Client> {
    const entity = ClientEntity.fromDomainModel(client);
    const savedEntity = await this.clientRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async update(client: Client): Promise<Client> {
    const entity = ClientEntity.fromDomainModel(client);
    const savedEntity = await this.clientRepository.save(entity);
    return savedEntity.toDomainModel();
  }

  async delete(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
