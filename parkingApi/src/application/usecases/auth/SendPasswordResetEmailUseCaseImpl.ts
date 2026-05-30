import { SendPasswordResetEmailUseCase } from '../../../domain/ports/in/auth/SendPasswordResetEmailUseCase';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';
import { MailSenderPort } from '../../../domain/ports/out/MailSenderPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';
import { BadRequestError } from '../../../domain/exceptions/BadRequestError';
import crypto from 'crypto';

export class SendPasswordResetEmailUseCaseImpl implements SendPasswordResetEmailUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly mailSender: MailSenderPort
    ) {}

    async execute(email: string, frontendUrl: string): Promise<void> {
        if (!email || !email.trim()) {
            throw new BadRequestError('El correo electrónico es requerido.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestError('El formato del correo electrónico no es válido.');
        }

        const user = await this.userRepository.findByEmail(email.trim());
        if (!user) {
            throw new NotFoundError('No se encontró ningún usuario con ese correo electrónico.');
        }

        // Generar un token criptográfico aleatorio
        const token = crypto.randomBytes(32).toString('hex');
        
        // Expiración: 1 hora a partir de ahora
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);

        // Guardar token y expiración en el usuario
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expirationDate;

        await this.userRepository.update(user);

        // Enviar el correo electrónico
        await this.mailSender.sendResetPasswordEmail(user.email!, token, frontendUrl);
    }
}
