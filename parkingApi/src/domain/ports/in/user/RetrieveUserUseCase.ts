import { User } from '../../../../domain/models/User';

export interface RetrieveUserUseCase {
    getUsers(): Promise<User[]>;
}
