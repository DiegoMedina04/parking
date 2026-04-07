import { Client } from '../../domain/models/Client';
import { CreateClientUseCase } from '../../domain/ports/in/client/CreateClientUseCase';
import { RetrieveClientUseCase } from '../../domain/ports/in/client/RetrieveClientUseCase';

export class ClientService implements RetrieveClientUseCase, CreateClientUseCase {
  constructor(
    private readonly retrieveClientUseCase: RetrieveClientUseCase,
    private readonly createClientUseCase: CreateClientUseCase
  ) {}

  async getClients(): Promise<Client[]> {
    return this.retrieveClientUseCase.getClients();
  }

  async findById(id: string): Promise<Client | null> {
    return this.retrieveClientUseCase.findById(id);
  }

  async save(client: Client): Promise<Client> {
    return this.createClientUseCase.save(client);
  }
}
