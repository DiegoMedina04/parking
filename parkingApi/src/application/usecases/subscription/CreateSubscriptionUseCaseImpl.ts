import { Subscription } from '../../../domain/models/Subscription';
import { CreateSubscriptionUseCase } from '../../../domain/ports/in/subscription/CreateSubscriptionUseCase';
import { SubscriptionRepositoryPort } from '../../../domain/ports/out/SubscriptionRepositoryPort';

export class CreateSubscriptionUseCaseImpl implements CreateSubscriptionUseCase {
  constructor(private readonly subscriptionRepositoryPort: SubscriptionRepositoryPort) {}

  async save(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepositoryPort.save(subscription);
  }
}
