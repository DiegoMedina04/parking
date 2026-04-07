import { Subscription } from '../../../../domain/models/Subscription';

export interface CreateSubscriptionUseCase {
    save(subscription: Subscription): Promise<Subscription>;
}
