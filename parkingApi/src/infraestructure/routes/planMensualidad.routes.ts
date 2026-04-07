import { Router } from 'express';
import { PlanMensualidadController } from '../controllers/PlanMensualidadController';

export const createPlanMensualidadRouter = (controller: PlanMensualidadController) => {
    const router = Router();

    router.post('/', (req, res) => controller.save(req, res));
    router.get('/', (req, res) => controller.findAll(req, res));
    router.get('/:id', (req, res) => controller.findById(req, res));

    return router;
};
