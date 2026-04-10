import { DeleteUserUseCase } from '../../../domain/ports/in/user/DeleteUserUseCase';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';

export class DeleteUserUseCaseImpl implements DeleteUserUseCase {
  constructor(private readonly userRepositoryPort: UserRepositoryPort) {}

  async delete(id: string): Promise<void> {
    return this.userRepositoryPort.delete(id);
  }
}
