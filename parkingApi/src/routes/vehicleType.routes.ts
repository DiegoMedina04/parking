import { Router } from 'express';
import { VehicleTypeController } from '../infraestructure/controllers/VehicleTypeController';
import { jwtValidationMiddleware } from '../infraestructure/security/jwt/JwtValidationMiddleware';

export const createVehicleTypeRouter = (vehicleTypeController: VehicleTypeController): Router => {
  const router = Router();

  router.use(jwtValidationMiddleware);

  router.get('/', vehicleTypeController.findAll.bind(vehicleTypeController));
  router.get('/:id', vehicleTypeController.findById.bind(vehicleTypeController));
  router.post('/', vehicleTypeController.save.bind(vehicleTypeController));

  return router;
};
