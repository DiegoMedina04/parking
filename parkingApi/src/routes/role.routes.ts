import { Router } from 'express';
import { RoleController } from '../infraestructure/controllers/RoleController';

export const createRoleRouter = (roleController: RoleController) => {
  const router = Router();

  router.get('/', (req, res) => roleController.findAll(req, res));
  router.post('/', (req, res) => roleController.save(req, res));

  return router;
};
