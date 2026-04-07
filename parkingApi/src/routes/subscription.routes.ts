import { Router } from 'express';
import { SubscriptionController } from '../infraestructure/controllers/SubscriptionController';

export const createSubscriptionRouter = (subscriptionController: SubscriptionController) => {
  const router = Router();

  router.get('/', (req, res) => subscriptionController.findAll(req, res));
  router.post('/', (req, res) => subscriptionController.save(req, res));

  return router;
};
