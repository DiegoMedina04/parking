import { Router } from 'express';
import { AuthController } from '../infraestructure/controllers/AuthController';

export const createAuthRouter = (authController: AuthController) => {
  const router = Router();

  router.post('/login', (req, res) => authController.login(req, res));
  router.post('/signup', (req, res) => authController.signup(req, res));
  router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
  router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

  return router;
};
