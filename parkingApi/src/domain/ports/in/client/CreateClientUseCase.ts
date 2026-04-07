import { Client } from '../../../../domain/models/Client';

export interface CreateClientUseCase {
    save(client: Client): Promise<Client>;
}
