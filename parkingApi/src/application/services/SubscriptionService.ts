import { Subscription } from '../../domain/models/Subscription';
import { CreateSubscriptionUseCase } from '../../domain/ports/in/subscription/CreateSubscriptionUseCase';
import { RetrieveSubscriptionUseCase } from '../../domain/ports/in/subscription/RetrieveSubscriptionUseCase';

export class SubscriptionService implements RetrieveSubscriptionUseCase, CreateSubscriptionUseCase {
  constructor(
    private readonly retrieveSubscriptionUseCase: RetrieveSubscriptionUseCase,
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase
  ) {}

  async getSubscriptions(): Promise<Subscription[]> {
    return this.retrieveSubscriptionUseCase.getSubscriptions();
  }

  async save(subscription: Subscription): Promise<Subscription> {
    return this.createSubscriptionUseCase.save(subscription);
  }
}
