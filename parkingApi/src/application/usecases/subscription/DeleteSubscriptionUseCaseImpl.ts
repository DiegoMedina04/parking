import { DeleteSubscriptionUseCase } from '../../../domain/ports/in/subscription/DeleteSubscriptionUseCase';
import { SubscriptionRepositoryPort } from '../../../domain/ports/out/SubscriptionRepositoryPort';

export class DeleteSubscriptionUseCaseImpl implements DeleteSubscriptionUseCase {
  constructor(private readonly subscriptionRepositoryPort: SubscriptionRepositoryPort) {}

  async delete(id: string): Promise<void> {
    return this.subscriptionRepositoryPort.delete(id);
  }
}
