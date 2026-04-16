import { Client } from '../../../../domain/models/Client';

export interface UpdateClientUseCase {
    update(client: Client): Promise<Client>;
}
