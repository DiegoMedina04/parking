import { Router } from 'express';
import { MensualidadController } from '../controllers/MensualidadController';
import { capacityLimitMiddleware } from '../security/CapacityLimitMiddleware';


export const createMensualidadRouter = (controller: MensualidadController) => {
    const router = Router();

    router.post('/', capacityLimitMiddleware, (req, res) => controller.save(req, res));
    router.get('/', (req, res) => controller.findAll(req, res));
    router.get('/payments/summary', (req, res) => controller.getPaymentSummary(req, res));
    router.get('/:id', (req, res) => controller.findById(req, res));
    router.get('/vehicle/:vehicleId', (req, res) => controller.findByVehicleId(req, res));
    router.post('/:id/pay', (req, res) => controller.pay(req, res));


    return router;
};
