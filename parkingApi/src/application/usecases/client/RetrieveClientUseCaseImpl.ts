import { Client } from '../../../domain/models/Client';
import { RetrieveClientUseCase } from '../../../domain/ports/in/client/RetrieveClientUseCase';
import { ClientRepositoryPort } from '../../../domain/ports/out/ClientRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class RetrieveClientUseCaseImpl implements RetrieveClientUseCase {
  constructor(private readonly clientRepositoryPort: ClientRepositoryPort) {}

  async getClients(parqueadero_id?: string): Promise<Client[]> {
    return this.clientRepositoryPort.findAll(parqueadero_id);
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.clientRepositoryPort.findById(id);
    if (!client) {
      throw new NotFoundError('Client not found');
    }
    return client;
  }
}
