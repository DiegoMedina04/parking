export interface ResetPasswordUseCase {
    execute(token: string, passwordPlain: string): Promise<void>;
}
