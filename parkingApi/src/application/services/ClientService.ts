import { Client } from '../../domain/models/Client';
import { CreateClientUseCase } from '../../domain/ports/in/client/CreateClientUseCase';
import { RetrieveClientUseCase } from '../../domain/ports/in/client/RetrieveClientUseCase';
import { UpdateClientUseCase } from '../../domain/ports/in/client/UpdateClientUseCase';
import { DeleteClientUseCase } from '../../domain/ports/in/client/DeleteClientUseCase';

export class ClientService implements RetrieveClientUseCase, CreateClientUseCase, UpdateClientUseCase, DeleteClientUseCase {
  constructor(
    private readonly retrieveClientUseCase: RetrieveClientUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase
  ) {}

  async getClients(parqueadero_id?: string): Promise<Client[]> {
    return this.retrieveClientUseCase.getClients(parqueadero_id);
  }

  async findById(id: string): Promise<Client | null> {
    return this.retrieveClientUseCase.findById(id);
  }

  async save(client: Client): Promise<Client> {
    return this.createClientUseCase.save(client);
  }

  async update(client: Client): Promise<Client> {
    return this.updateClientUseCase.update(client);
  }

  async delete(id: string): Promise<void> {
    return this.deleteClientUseCase.delete(id);
  }
}
