import { User } from '../../domain/models/User';
import { CreateUserUseCase } from '../../domain/ports/in/user/CreateUserUseCase';
import { RetrieveUserUseCase } from '../../domain/ports/in/user/RetrieveUserUseCase';

export class UserService implements RetrieveUserUseCase, CreateUserUseCase {
  constructor(
    private readonly retrieveUserUseCase: RetrieveUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async getUsers(): Promise<User[]> {
    return this.retrieveUserUseCase.getUsers();
  }

  async save(user: User): Promise<User> {
    return this.createUserUseCase.save(user);
  }
}
