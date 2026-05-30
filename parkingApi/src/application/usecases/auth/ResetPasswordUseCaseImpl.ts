import { ResetPasswordUseCase } from '../../../domain/ports/in/auth/ResetPasswordUseCase';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';
import { PasswordHasherPort } from '../../../domain/ports/out/PasswordHasherPort';
import { BadRequestError } from '../../../domain/exceptions/BadRequestError';

export class ResetPasswordUseCaseImpl implements ResetPasswordUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly passwordHasher: PasswordHasherPort
    ) {}

    async execute(token: string, passwordPlain: string): Promise<void> {
        if (!token || !token.trim()) {
            throw new BadRequestError('El token de recuperación es requerido.');
        }

        if (!passwordPlain || passwordPlain.length < 6) {
            throw new BadRequestError('La nueva contraseña debe tener al menos 6 caracteres.');
        }

        const user = await this.userRepository.findByResetToken(token.trim());
        
        if (!user) {
            throw new BadRequestError('El token de restablecimiento es inválido o no existe.');
        }

        // Validar expiración del token
        if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
            throw new BadRequestError('El token de restablecimiento ha expirado.');
        }

        // Hashear la nueva contraseña
        const hashedPassword = await this.passwordHasher.hash(passwordPlain);

        // Actualizar usuario limpiando los campos del token de recuperación
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await this.userRepository.update(user);
    }
}
