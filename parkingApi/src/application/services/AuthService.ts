import { LoginUseCaseImpl, LoginResult } from '../usecases/auth/LoginUseCaseImpl';

export class AuthService {
    constructor(
        private readonly loginUseCase: LoginUseCaseImpl
    ) {}

    async login(email: string, passwordPlain: string): Promise<LoginResult | null> {
        return this.loginUseCase.execute(email, passwordPlain);
    }
}
