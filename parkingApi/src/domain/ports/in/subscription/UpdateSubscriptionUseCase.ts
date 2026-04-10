import { Subscription } from '../../../../domain/models/Subscription';

export interface UpdateSubscriptionUseCase {
  update(subscription: Subscription): Promise<Subscription>;
}
