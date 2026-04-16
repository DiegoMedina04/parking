import { Client } from '../../../domain/models/Client';
import { UpdateClientUseCase } from '../../../domain/ports/in/client/UpdateClientUseCase';
import { ClientRepositoryPort } from '../../../domain/ports/out/ClientRepositoryPort';

export class UpdateClientUseCaseImpl implements UpdateClientUseCase {
  constructor(private readonly clientRepositoryPort: ClientRepositoryPort) {}

  async update(client: Client): Promise<Client> {
    return this.clientRepositoryPort.update(client);
  }
}
