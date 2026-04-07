import { Request, Response } from 'express';
import { PlanService } from '../../application/services/PlanService';
import { Plan } from '../../domain/models/Plan';

export class PlanController {
  constructor(private readonly planService: PlanService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const plans = await this.planService.getPlans();
    res.status(200).json(plans);
  }

  async save(req: Request, res: Response): Promise<void> {
    const plan: Plan = req.body;
    const savedPlan = await this.planService.save(plan);
    res.status(201).json(savedPlan);
  }
}
