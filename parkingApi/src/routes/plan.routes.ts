import { Router } from 'express';
import { PlanController } from '../infraestructure/controllers/PlanController';

export const createPlanRouter = (planController: PlanController) => {
  const router = Router();

  router.get('/', (req, res) => planController.findAll(req, res));
  router.post('/', (req, res) => planController.save(req, res));
  router.put('/:id', (req, res) => planController.update(req, res));
  router.delete('/:id', (req, res) => planController.delete(req, res));

  return router;
};
