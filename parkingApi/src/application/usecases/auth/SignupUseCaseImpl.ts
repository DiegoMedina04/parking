import { User } from '../../../domain/models/User';
import { SignupUseCase } from '../../../domain/ports/in/auth/SignupUseCase';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';
import { RoleRepositoryPort } from '../../../domain/ports/out/RoleRepositoryPort';
import { PasswordHasherPort } from '../../../domain/ports/out/PasswordHasherPort';
import { ROLES } from '../../../domain/constants/roles';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class SignupUseCaseImpl implements SignupUseCase {
    constructor(
        private readonly userRepositoryPort: UserRepositoryPort,
        private readonly roleRepositoryPort: RoleRepositoryPort,
        private readonly passwordHasher: PasswordHasherPort
    ) {}

    async execute(user: User): Promise<User> {
        // Asignar rol de OPERADOR automáticamente
        const operatorRole = await this.roleRepositoryPort.findByName(ROLES.OPERATOR);
        
        if (!operatorRole) {
            throw new NotFoundError(`El rol ${ROLES.OPERATOR} no está configurado en el sistema.`);
        }

        user.role = operatorRole;

        // Hashear la contraseña
        if (user.password) {
            user.password = await this.passwordHasher.hash(user.password);
        }

        // Persistir el usuario
        return this.userRepositoryPort.save(user);
    }
}
