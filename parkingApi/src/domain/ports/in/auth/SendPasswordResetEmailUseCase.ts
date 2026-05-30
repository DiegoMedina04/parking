export interface SendPasswordResetEmailUseCase {
    execute(email: string, frontendUrl: string): Promise<void>;
}
