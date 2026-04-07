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
}
