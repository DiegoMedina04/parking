import { LoginUseCaseImpl, LoginResult } from '../usecases/auth/LoginUseCaseImpl';
import { SignupUseCase } from '../../domain/ports/in/auth/SignupUseCase';
import { SendPasswordResetEmailUseCase } from '../../domain/ports/in/auth/SendPasswordResetEmailUseCase';
import { ResetPasswordUseCase } from '../../domain/ports/in/auth/ResetPasswordUseCase';
import { User } from '../../domain/models/User';

export class AuthService {
    constructor(
        private readonly loginUseCase: LoginUseCaseImpl,
        private readonly signupUseCase: SignupUseCase,
        private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase
    ) {}

    async login(email: string, passwordPlain: string): Promise<LoginResult | null> {
        return this.loginUseCase.execute(email, passwordPlain);
    }

    async signup(user: User): Promise<User> {
        return this.signupUseCase.execute(user);
    }

    async sendPasswordResetEmail(email: string, frontendUrl: string): Promise<void> {
        return this.sendPasswordResetEmailUseCase.execute(email, frontendUrl);
    }

    async resetPassword(token: string, passwordPlain: string): Promise<void> {
        return this.resetPasswordUseCase.execute(token, passwordPlain);
    }
}
