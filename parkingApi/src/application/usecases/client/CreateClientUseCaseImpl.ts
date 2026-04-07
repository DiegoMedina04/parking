import { Client } from '../../../domain/models/Client';
import { CreateClientUseCase } from '../../../domain/ports/in/client/CreateClientUseCase';
import { ClientRepositoryPort } from '../../../domain/ports/out/ClientRepositoryPort';

export class CreateClientUseCaseImpl implements CreateClientUseCase {
  constructor(private readonly clientRepositoryPort: ClientRepositoryPort) {}

  async save(client: Client): Promise<Client> {
    return this.clientRepositoryPort.save(client);
  }
}
