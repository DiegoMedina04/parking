import { MailSenderPort } from '../../../domain/ports/out/MailSenderPort';

export class ConsoleMailSenderAdapter implements MailSenderPort {
    async sendResetPasswordEmail(email: string, token: string, frontendUrl: string): Promise<void> {
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        console.log("\n");
        console.log("╔══════════════════════════════════════════════════════════════════════════════════════╗");
        console.log("║                       📬 CORREO ELECTRÓNICO ENVIADO (SIMULADO)                        ║");
        console.log("╠══════════════════════════════════════════════════════════════════════════════════════╣");
        console.log(`║  Para:      ${email.padEnd(72)} ║`);
        console.log(`║  Asunto:    Restablece tu contraseña de ParkingPro                                   ║`);
        console.log("║                                                                                      ║");
        console.log("║  Hola,                                                                               ║");
        console.log("║  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.          ║");
        console.log("║  Haz clic en el siguiente enlace para definir una nueva contraseña:                  ║");
        console.log("║                                                                                      ║");
        console.log(`║  👉  ${resetLink.padEnd(80)} ║`);
        console.log("║                                                                                      ║");
        console.log("║  Si no solicitaste este cambio, puedes ignorar este correo de forma segura.          ║");
        console.log("║  Este enlace es válido por 1 hora.                                                   ║");
        console.log("╚══════════════════════════════════════════════════════════════════════════════════════╝");
        console.log("\n");
    }
}
