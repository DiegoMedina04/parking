import { Router } from 'express';
import { MensualidadController } from '../controllers/MensualidadController';

export const createMensualidadRouter = (controller: MensualidadController) => {
    const router = Router();

    router.post('/', (req, res) => controller.save(req, res));
    router.get('/', (req, res) => controller.findAll(req, res));
    router.get('/:id', (req, res) => controller.findById(req, res));
    router.get('/vehicle/:vehicleId', (req, res) => controller.findByVehicleId(req, res));

    return router;
};
