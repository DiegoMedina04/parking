import { Router } from 'express';
import { AuthController } from '../infraestructure/controllers/AuthController';

export const createAuthRouter = (authController: AuthController) => {
  const router = Router();

  router.post('/login', (req, res) => authController.login(req, res));
  router.post('/signup', (req, res) => authController.signup(req, res));

  return router;
};
