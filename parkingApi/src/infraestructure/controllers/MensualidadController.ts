import { Request, Response } from 'express';
import { MensualidadService } from '../../application/services/MensualidadService';
import { Mensualidad, MensualidadStatus } from '../../domain/models/Mensualidad';

export class MensualidadController {
    constructor(private readonly mensualidadService: MensualidadService) {}

    async save(req: Request, res: Response) {
        const mensualidadData = req.body as Mensualidad;
        const newMensualidad = await this.mensualidadService.save(mensualidadData);
        res.status(201).json(newMensualidad);
    }

    async findById(req: Request, res: Response) {
        const id = req.params.id as string;
        const mensualidad = await this.mensualidadService.findById(id);
        if (!mensualidad) {
            return res.status(404).json({ message: 'Mensualidad no encontrada' });
        }
        res.json(mensualidad);
    }

    async findAll(req: Request, res: Response) {
        const mensualidades = await this.mensualidadService.findAll();
        res.json(mensualidades);
    }

    async findByVehicleId(req: Request, res: Response) {
        const vehicleId = req.params.vehicleId as string;
        const mensualidades = await this.mensualidadService.findByVehicleId(vehicleId);
        res.json(mensualidades);
    }
}
