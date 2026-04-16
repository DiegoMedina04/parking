import { Router } from 'express';
import { ClientController } from '../infraestructure/controllers/ClientController';
import { jwtValidationMiddleware } from '../infraestructure/security/jwt/JwtValidationMiddleware';

export const createClientRouter = (clientController: ClientController): Router => {
  const router = Router();

  // All client routes are protected
  router.use(jwtValidationMiddleware);

  /**
   * @swagger
   * /client:
   *   get:
   *     tags: [Clients]
   *     summary: Get all clients
   */
  router.get('/', clientController.findAll.bind(clientController));

  /**
   * @swagger
   * /client/{id}:
   *   get:
   *     tags: [Clients]
   *     summary: Get client by ID
   */
  router.get('/:id', clientController.findById.bind(clientController));

  /**
   * @swagger
   * /client:
   *   post:
   *     tags: [Clients]
   *     summary: Create a new client
   */
  router.post('/', clientController.save.bind(clientController));
  router.put('/:id', clientController.update.bind(clientController));
  router.delete('/:id', clientController.delete.bind(clientController));

  return router;
};
