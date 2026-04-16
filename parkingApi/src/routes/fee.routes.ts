import { Router } from 'express';
import { FeeController } from '../infraestructure/controllers/FeeController';

export const createFeeRouter = (feeController: FeeController) => {
  const router = Router();

  router.post('/', (req, res) => feeController.create(req, res));
  router.get('/', (req, res) => feeController.getAll(req, res));
  router.get('/:id', (req, res) => feeController.getById(req, res));
  router.put('/:id', (req, res) => feeController.update(req, res));
  router.delete('/:id', (req, res) => feeController.delete(req, res));

  return router;
};
