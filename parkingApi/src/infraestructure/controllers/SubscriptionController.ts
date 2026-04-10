import { Request, Response } from 'express';
import { SubscriptionService } from '../../application/services/SubscriptionService';
import { Subscription } from '../../domain/models/Subscription';

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const subscriptions = await this.subscriptionService.getSubscriptions();
    res.status(200).json(subscriptions);
  }

  async save(req: Request, res: Response): Promise<void> {
    const subscription: Subscription = req.body;
    const savedSubscription = await this.subscriptionService.save(subscription);
    res.status(201).json(savedSubscription);
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const subscription: Subscription = req.body;
    subscription.id = id;
    const updatedSubscription = await this.subscriptionService.update(subscription);
    res.status(200).json(updatedSubscription);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await this.subscriptionService.delete(id);
    res.status(204).send();
  }
}
