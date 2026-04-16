import { User } from '../../../domain/models/User';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';
import { PasswordHasherPort } from '../../../domain/ports/out/PasswordHasherPort';
import { JwtGeneratorPort } from '../../../domain/ports/out/JwtGeneratorPort';

export interface LoginResult {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role?: string;
        parqueadero_id?: string;
    };
}

export class LoginUseCaseImpl {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly passwordHasher: PasswordHasherPort,
        private readonly jwtGenerator: JwtGeneratorPort
    ) {}

    async execute(email: string, passwordPlain: string): Promise<LoginResult | null> {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user || !user.password) {
            return null; // Usuario no encontrado o contraseña inválida en DB
        }

        const isPasswordValid = await this.passwordHasher.compare(passwordPlain, user.password);
        
        if (!isPasswordValid) {
            return null; // Contraseña incorrecta
        }

        const token = this.jwtGenerator.generateToken(user);
        
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email || '',
                role: user.role?.name,
                parqueadero_id: user.parking && user.parking.length > 0 ? user.parking[0].id : undefined
            }
        };
    }
}
