import { User } from '../../../../domain/models/User';

export interface UpdateUserUseCase {
  update(user: User): Promise<User>;
}
