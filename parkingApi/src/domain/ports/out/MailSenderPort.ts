export interface MailSenderPort {
    sendResetPasswordEmail(email: string, token: string, frontendUrl: string): Promise<void>;
}
