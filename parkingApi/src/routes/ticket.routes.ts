import { Router } from 'express';
import { TicketController } from '../infraestructure/controllers/TicketController';

export const createTicketRouter = (ticketController: TicketController) => {
  const router = Router();

  router.get('/', (req, res) => ticketController.findAll(req, res));
  router.get('/:id', (req, res) => ticketController.findById(req, res));
  router.post('/', (req, res) => ticketController.save(req, res));
  router.patch('/checkout/:id', (req, res) => ticketController.checkout(req, res));
  router.get('/active/:vehicleId', (req, res) => ticketController.getActiveTicketByVehicleId(req, res));

  return router;
};
