import { User } from '../../../../domain/models/User';

export interface CreateUserUseCase {
    save(user: User): Promise<User>;
}
