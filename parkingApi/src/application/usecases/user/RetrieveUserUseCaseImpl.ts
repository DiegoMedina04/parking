import { User } from '../../../domain/models/User';
import { RetrieveUserUseCase } from '../../../domain/ports/in/user/RetrieveUserUseCase';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';

export class RetrieveUserUseCaseImpl implements RetrieveUserUseCase {
  constructor(private readonly userRepositoryPort: UserRepositoryPort) {}

  async getUsers(): Promise<User[]> {
    return this.userRepositoryPort.findAll();
  }
}
