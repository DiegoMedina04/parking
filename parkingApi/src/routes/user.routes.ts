import { Router } from 'express';
import { UserController } from '../infraestructure/controllers/UserController';
// The controller would need a service, which we'll assume is wired elsewhere or mock it here for the structure
// For now, focusing on the ROUTE structure

export const createUserRouter = (userController: UserController) => {
  const router = Router();

  router.get('/', (req, res) => userController.findAll(req, res));
  router.post('/', (req, res) => userController.save(req, res));
  router.put('/:id', (req, res) => userController.update(req, res));
  router.delete('/:id', (req, res) => userController.delete(req, res));

  return router;
};
