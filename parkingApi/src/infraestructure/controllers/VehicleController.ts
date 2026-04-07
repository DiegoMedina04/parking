import { Request, Response } from 'express';
import { VehicleService } from '../../application/services/VehicleService';
import { Vehicle } from '../../domain/models/Vehicle';

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Gestión de vehículos
 */

export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const vehicles = await this.vehicleService.getVehicles();
    res.status(200).json(vehicles);
  }

  async save(req: Request, res: Response): Promise<void> {
    const vehicle: Vehicle = req.body;
    const savedVehicle = await this.vehicleService.save(vehicle);
    res.status(201).json(savedVehicle);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const vehicle = await this.vehicleService.findById(String(id));
    res.status(200).json(vehicle);
  }
}
