import { Client } from '../../../domain/models/Client';
import { CreateClientUseCase } from '../../../domain/ports/in/client/CreateClientUseCase';
import { ClientRepositoryPort } from '../../../domain/ports/out/ClientRepositoryPort';
import { BadRequestError } from '../../../domain/exceptions/BadRequestError';

export class CreateClientUseCaseImpl implements CreateClientUseCase {
  constructor(private readonly clientRepositoryPort: ClientRepositoryPort) {}

  async save(client: Client): Promise<Client> {
    const existingClient = await this.clientRepositoryPort.findByDocument(client.document, client.parqueadero_id);
    if (existingClient) {
      throw new BadRequestError(`Ya existe un cliente registrado con la cédula ${client.document} en esta sede`);
    }
    return this.clientRepositoryPort.save(client);
  }
}
