import { Subscription } from '../../../../domain/models/Subscription';

export interface RetrieveSubscriptionUseCase {
    getSubscriptions(): Promise<Subscription[]>;
}
