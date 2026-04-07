import { Request, Response } from 'express';
import { VehicleTypeService } from '../../application/services/VehicleTypeService';
import { VehicleType } from '../../domain/models/VehicleType';

/**
 * @swagger
 * tags:
 *   name: VehicleTypes
 *   description: Gestión de tipos de vehículos
 */

export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const vehicleTypes = await this.vehicleTypeService.getVehicleTypes();
    res.status(200).json(vehicleTypes);
  }

  async save(req: Request, res: Response): Promise<void> {
    const vehicleType: VehicleType = req.body;
    const savedVehicleType = await this.vehicleTypeService.save(vehicleType);
    res.status(201).json(savedVehicleType);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const vehicleType = await this.vehicleTypeService.findById(String(id));
    res.status(200).json(vehicleType);
  }
}
