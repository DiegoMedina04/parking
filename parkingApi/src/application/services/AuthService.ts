import { LoginUseCaseImpl, LoginResult } from '../usecases/auth/LoginUseCaseImpl';
import { SignupUseCase } from '../../domain/ports/in/auth/SignupUseCase';
import { User } from '../../domain/models/User';

export class AuthService {
    constructor(
        private readonly loginUseCase: LoginUseCaseImpl,
        private readonly signupUseCase: SignupUseCase
    ) {}

    async login(email: string, passwordPlain: string): Promise<LoginResult | null> {
        return this.loginUseCase.execute(email, passwordPlain);
    }

    async signup(user: User): Promise<User> {
        return this.signupUseCase.execute(user);
    }
}
