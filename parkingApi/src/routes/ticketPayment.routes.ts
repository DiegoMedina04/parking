import { Router } from 'express';
import { TicketPaymentController } from '../infraestructure/controllers/TicketPaymentController';

export const createTicketPaymentRouter = (controller: TicketPaymentController): Router => {
    const router = Router();

    router.get('/', (req, res) => controller.findAll(req, res));
    router.get('/:id', (req, res) => controller.findById(req, res));
    router.get('/ticket/:ticketId', (req, res) => controller.findByTicketId(req, res));
    router.post('/', (req, res) => controller.save(req, res));

    return router;
};
