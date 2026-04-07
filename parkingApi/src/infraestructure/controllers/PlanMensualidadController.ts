import { Request, Response } from 'express';
import { PlanMensualidadService } from '../../application/services/PlanMensualidadService';
import { PlanMensualidad } from '../../domain/models/PlanMensualidad';

export class PlanMensualidadController {
    constructor(private readonly planService: PlanMensualidadService) {}

    async save(req: Request, res: Response) {
        const planData = req.body as PlanMensualidad;
        const newPlan = await this.planService.save(planData);
        res.status(201).json(newPlan);
    }

    async findById(req: Request, res: Response) {
        const id = req.params.id as string;
        const plan = await this.planService.findById(id);
        if (!plan) {
            return res.status(404).json({ message: 'PlanMensualidad no encontrado' });
        }
        res.json(plan);
    }

    async findAll(req: Request, res: Response) {
        const plans = await this.planService.findAll();
        res.json(plans);
    }
}
