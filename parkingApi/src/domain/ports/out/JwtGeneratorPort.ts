import { User } from '../../models/User';

export interface JwtGeneratorPort {
    generateToken(user: User): string;
}
