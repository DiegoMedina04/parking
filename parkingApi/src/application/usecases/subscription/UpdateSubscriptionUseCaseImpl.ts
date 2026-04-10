import { Subscription } from '../../../domain/models/Subscription';
import { UpdateSubscriptionUseCase } from '../../../domain/ports/in/subscription/UpdateSubscriptionUseCase';
import { SubscriptionRepositoryPort } from '../../../domain/ports/out/SubscriptionRepositoryPort';

export class UpdateSubscriptionUseCaseImpl implements UpdateSubscriptionUseCase {
  constructor(private readonly subscriptionRepositoryPort: SubscriptionRepositoryPort) {}

  async update(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepositoryPort.update(subscription);
  }
}
