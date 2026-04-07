import { User } from '../../../domain/models/User';
import { CreateUserUseCase } from '../../../domain/ports/in/user/CreateUserUseCase';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';
import { RoleRepositoryPort } from '../../../domain/ports/out/RoleRepositoryPort';
import { PasswordHasherPort } from '../../../domain/ports/out/PasswordHasherPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly roleRepositoryPort: RoleRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async save(user: User): Promise<User> {
    if (user.role && user.role.id) {
      const roleExists = await this.roleRepositoryPort.findById(user.role.id);
      if (!roleExists) {
        throw new NotFoundError(`Role with ID ${user.role.id} does not exist`);
      }
    }

    if (user.password) {
      user.password = await this.passwordHasher.hash(user.password);
    }

    return this.userRepositoryPort.save(user);
  }
}
