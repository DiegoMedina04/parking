import { Subscription } from '../../../domain/models/Subscription';
import { RetrieveSubscriptionUseCase } from '../../../domain/ports/in/subscription/RetrieveSubscriptionUseCase';
import { SubscriptionRepositoryPort } from '../../../domain/ports/out/SubscriptionRepositoryPort';

export class RetrieveSubscriptionUseCaseImpl implements RetrieveSubscriptionUseCase {
  constructor(private readonly subscriptionRepositoryPort: SubscriptionRepositoryPort) {}

  async getSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionRepositoryPort.findAll();
  }
}
