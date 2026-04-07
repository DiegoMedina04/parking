import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtGeneratorPort } from '../../../domain/ports/out/JwtGeneratorPort';
import { User } from '../../../domain/models/User';

export class JwtGeneratorAdapter implements JwtGeneratorPort {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'super_secret_key';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    generateToken(user: User): string {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role?.name
        };
        const options: SignOptions = { expiresIn: this.expiresIn as any };
        return jwt.sign(payload, this.secret, options);
    }
}
