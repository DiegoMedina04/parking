import { User } from '../../../domain/models/User';
import { UserRepositoryPort } from '../../../domain/ports/out/UserRepositoryPort';
import { PasswordHasherPort } from '../../../domain/ports/out/PasswordHasherPort';
import { JwtGeneratorPort } from '../../../domain/ports/out/JwtGeneratorPort';
import { SubscriptionRepositoryPort } from '../../../domain/ports/out/SubscriptionRepositoryPort';

export interface LoginResult {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role?: string;
        parqueadero_id?: string;
        is_subscription_active: boolean;
    };
}

export class LoginUseCaseImpl {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly passwordHasher: PasswordHasherPort,
        private readonly jwtGenerator: JwtGeneratorPort,
        private readonly subscriptionRepository: SubscriptionRepositoryPort
    ) {}

    async execute(email: string, passwordPlain: string): Promise<LoginResult | null> {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user || !user.password) {
            return null; 
        }

        const isPasswordValid = await this.passwordHasher.compare(passwordPlain, user.password);
        
        if (!isPasswordValid) {
            return null; // Contraseña incorrecta
        }

        const token = this.jwtGenerator.generateToken(user);
        
        const parqueadero_id = user.parking && user.parking.length > 0 ? user.parking[0].id : undefined;
        let is_subscription_active = true; // Por defecto true para SuperAdmins sin parqueadero

        if (parqueadero_id) {
            is_subscription_active = false;
            const subscription = await this.subscriptionRepository.findLatestActiveByParkingId(parqueadero_id);

            if (subscription) {
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                let isExpired = false;
                
                if(subscription.startDate<= currentDate && subscription.endDate>= currentDate ){
                    is_subscription_active = true;
                }
               
            }
        }
        
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email || '',
                role: user.role?.name,
                parqueadero_id,
                is_subscription_active
            }
        };
    }
}
