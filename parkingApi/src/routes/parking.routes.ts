import { Router } from 'express';
import { ParkingController } from '../infraestructure/controllers/ParkingController';

export const createParkingRouter = (parkingController: ParkingController) => {
  const router = Router();

  router.get('/', (req, res) => parkingController.findAll(req, res));
  router.post('/', (req, res) => parkingController.save(req, res));

  return router;
};
