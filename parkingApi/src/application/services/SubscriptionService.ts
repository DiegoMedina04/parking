import { Subscription } from '../../domain/models/Subscription';
import { CreateSubscriptionUseCase } from '../../domain/ports/in/subscription/CreateSubscriptionUseCase';
import { RetrieveSubscriptionUseCase } from '../../domain/ports/in/subscription/RetrieveSubscriptionUseCase';
import { UpdateSubscriptionUseCase } from '../../domain/ports/in/subscription/UpdateSubscriptionUseCase';
import { DeleteSubscriptionUseCase } from '../../domain/ports/in/subscription/DeleteSubscriptionUseCase';

export class SubscriptionService implements RetrieveSubscriptionUseCase, CreateSubscriptionUseCase, UpdateSubscriptionUseCase, DeleteSubscriptionUseCase {
  constructor(
    private readonly retrieveSubscriptionUseCase: RetrieveSubscriptionUseCase,
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly updateSubscriptionUseCase: UpdateSubscriptionUseCase,
    private readonly deleteSubscriptionUseCase: DeleteSubscriptionUseCase
  ) {}

  async getSubscriptions(): Promise<Subscription[]> {
    return this.retrieveSubscriptionUseCase.getSubscriptions();
  }

  async save(subscription: Subscription): Promise<Subscription> {
    return this.createSubscriptionUseCase.save(subscription);
  }

  async update(subscription: Subscription): Promise<Subscription> {
    return this.updateSubscriptionUseCase.update(subscription);
  }

  async delete(id: string): Promise<void> {
    return this.deleteSubscriptionUseCase.delete(id);
  }
}
