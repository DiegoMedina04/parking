import { Client } from '../../../../domain/models/Client';

export interface RetrieveClientUseCase {
    getClients(): Promise<Client[]>;
    findById(id: string): Promise<Client | null>;
}
