import nodemailer, { Transporter } from 'nodemailer';
import { MailSenderPort } from '../../../domain/ports/out/MailSenderPort';

export class NodemailerMailSenderAdapter implements MailSenderPort {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 587,
            secure: process.env.MAIL_SECURE === 'true', // true para 465, false para otros
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendResetPasswordEmail(email: string, token: string, frontendUrl: string): Promise<void> {
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        const fromName = process.env.MAIL_FROM_NAME || 'ParkingPro';
        const fromAddress = process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USER;

        const htmlBody = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Restablecer contraseña</title>
        </head>
        <body style="margin:0;padding:0;background-color:#0f1117;font-family:'Segoe UI',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1117;padding:40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1d2e 0%,#16213e 100%);border-radius:16px;border:1px solid rgba(99,102,241,0.25);overflow:hidden;max-width:600px;width:100%;">
                            <!-- Header -->
                            <tr>
                                <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 40px;text-align:center;">
                                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🅿 ParkingPro</h1>
                                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Sistema de gestión de parqueaderos</p>
                                </td>
                            </tr>
                            <!-- Body -->
                            <tr>
                                <td style="padding:40px 40px 32px;">
                                    <h2 style="margin:0 0 16px;color:#e2e8f0;font-size:22px;font-weight:600;">Restablecer tu contraseña</h2>
                                    <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.6;">
                                        Hola,<br/><br/>
                                        Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong style="color:#a5b4fc;">ParkingPro</strong>.
                                        Haz clic en el botón a continuación para crear una contraseña nueva.
                                    </p>
                                    <!-- CTA Button -->
                                    <table cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" style="padding:8px 0 32px;">
                                                <a href="${resetLink}"
                                                   style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:10px;letter-spacing:0.3px;">
                                                    Restablecer contraseña
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Link fallback -->
                                    <p style="margin:0 0 8px;color:#64748b;font-size:13px;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                                    <p style="margin:0 0 32px;word-break:break-all;">
                                        <a href="${resetLink}" style="color:#818cf8;font-size:13px;">${resetLink}</a>
                                    </p>
                                    <!-- Warning -->
                                    <table cellpadding="0" cellspacing="0" width="100%" style="background:rgba(99,102,241,0.08);border-left:3px solid #6366f1;border-radius:0 8px 8px 0;">
                                        <tr>
                                            <td style="padding:14px 18px;">
                                                <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;">
                                                    ⏰ <strong style="color:#a5b4fc;">Este enlace expira en 1 hora.</strong><br/>
                                                    Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no cambiará.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding:20px 40px 32px;border-top:1px solid rgba(99,102,241,0.15);text-align:center;">
                                    <p style="margin:0;color:#475569;font-size:12px;line-height:1.6;">
                                        © ${new Date().getFullYear()} ParkingPro · Este es un correo automático, por favor no respondas.<br/>
                                        Si necesitas ayuda, contacta a soporte.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        await this.transporter.sendMail({
            from: `"${fromName}" <${fromAddress}>`,
            to: email,
            subject: 'Restablece tu contraseña – ParkingPro',
            html: htmlBody,
            text: `Restablece tu contraseña de ParkingPro\n\nHaz clic en el siguiente enlace (válido por 1 hora):\n${resetLink}\n\nSi no solicitaste este cambio, ignora este correo.`,
        });

        console.log(`[NodemailerMailSenderAdapter] Correo enviado a: ${email}`);
    }
}
