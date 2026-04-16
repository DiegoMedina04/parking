import { Client } from '../../../../domain/models/Client';

export interface RetrieveClientUseCase {
    getClients(parqueadero_id?: string): Promise<Client[]>;
    findById(id: string): Promise<Client | null>;
}
