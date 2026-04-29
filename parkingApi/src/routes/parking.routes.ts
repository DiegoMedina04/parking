import { Router } from 'express';
import { ParkingController } from '../infraestructure/controllers/ParkingController';

export const createParkingRouter = (parkingController: ParkingController) => {
  const router = Router();

  router.get('/', (req, res) => parkingController.findAll(req, res));
  router.post('/', (req, res) => parkingController.save(req, res));
  router.put('/:id', (req, res) => parkingController.update(req, res));
  router.delete('/:id', (req, res) => parkingController.delete(req, res));
  router.get('/:id/capacity', (req, res) => parkingController.getCapacity(req, res));


  return router;
};
