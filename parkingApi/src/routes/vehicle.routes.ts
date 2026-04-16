import { Router } from 'express';
import { VehicleController } from '../infraestructure/controllers/VehicleController';
import { jwtValidationMiddleware } from '../infraestructure/security/jwt/JwtValidationMiddleware';

export const createVehicleRouter = (vehicleController: VehicleController): Router => {
  const router = Router();

  router.use(jwtValidationMiddleware);

  router.get('/', vehicleController.findAll.bind(vehicleController));
  router.get('/:id', vehicleController.findById.bind(vehicleController));
  router.post('/', vehicleController.save.bind(vehicleController));
  router.put('/:id', vehicleController.update.bind(vehicleController));
  router.delete('/:id', vehicleController.delete.bind(vehicleController));

  return router;
};
