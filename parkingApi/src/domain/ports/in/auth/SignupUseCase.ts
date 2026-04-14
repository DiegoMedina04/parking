import { User } from '../../models/User';

export interface SignupUseCase {
    execute(user: User): Promise<User>;
}
