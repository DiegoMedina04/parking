import { User } from '../../../domain/models/User';
import { UpdateUserUseCase } from '../../../domain/ports/in/user/UpdateUserUseCase';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';
import { RoleRepositoryPort } from '../../../domain/ports/out/RoleRepositoryPort';
import { PasswordHasherPort } from '../../../domain/ports/out/PasswordHasherPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly roleRepositoryPort: RoleRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async update(user: User): Promise<User> {
    const existingUser = await this.userRepositoryPort.findById(user.id);
    if (!existingUser) {
      throw new NotFoundError(`User with ID ${user.id} not found`);
    }

    if (user.role && user.role.id) {
      const roleExists = await this.roleRepositoryPort.findById(user.role.id);
      if (!roleExists) {
        throw new NotFoundError(`Role with ID ${user.role.id} does not exist`);
      }
    }

    // Si hay una nueva contraseña, hashearla. Si no, mantener la anterior.
    if (user.password && user.password.trim() !== '') {
      user.password = await this.passwordHasher.hash(user.password);
    } else {
      user.password = existingUser.password;
    }

    return this.userRepositoryPort.save(user);
  }
}
