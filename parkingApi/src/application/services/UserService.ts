import { User } from '../../domain/models/User';
import { CreateUserUseCase } from '../../domain/ports/in/user/CreateUserUseCase';
import { RetrieveUserUseCase } from '../../domain/ports/in/user/RetrieveUserUseCase';
import { UpdateUserUseCase } from '../../domain/ports/in/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../domain/ports/in/user/DeleteUserUseCase';

export class UserService implements RetrieveUserUseCase, CreateUserUseCase, UpdateUserUseCase, DeleteUserUseCase {
  constructor(
    private readonly retrieveUserUseCase: RetrieveUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  async getUsers(): Promise<User[]> {
    return this.retrieveUserUseCase.getUsers();
  }

  async save(user: User): Promise<User> {
    return this.createUserUseCase.save(user);
  }

  async update(user: User): Promise<User> {
    return this.updateUserUseCase.update(user);
  }

  async delete(id: string): Promise<void> {
    return this.deleteUserUseCase.delete(id);
  }
}
