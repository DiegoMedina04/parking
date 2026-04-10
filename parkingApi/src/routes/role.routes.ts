import { Router } from 'express';
import { RoleController } from '../infraestructure/controllers/RoleController';

export const createRoleRouter = (roleController: RoleController) => {
  const router = Router();

  router.get('/', (req, res) => roleController.findAll(req, res));
  router.post('/', (req, res) => roleController.save(req, res));
  router.put('/:id', (req, res) => roleController.update(req, res));
  router.delete('/:id', (req, res) => roleController.delete(req, res));

  return router;
};
