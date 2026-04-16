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
    const parqueadero_id = req.query.parqueadero_id as string | undefined;
    const vehicles = await this.vehicleService.getVehicles(parqueadero_id);
    res.status(200).json(vehicles);
  }

  async save(req: Request, res: Response): Promise<void> {
    const body = req.body;
    let vehicle: Vehicle = body;
    if (body.parqueadero_id) {
       vehicle = { ...body, parking: { id: body.parqueadero_id } };
    }
    const savedVehicle = await this.vehicleService.save(vehicle);
    res.status(201).json(savedVehicle);
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const vehicle = await this.vehicleService.findById(String(id));
    res.status(200).json(vehicle);
  }

  async update(req: Request, res: Response): Promise<void> {
    const body = req.body;
    let vehicle: Vehicle = body;
    if (body.parqueadero_id) {
       vehicle = { ...body, parking: { id: body.parqueadero_id } };
    }
    const updatedVehicle = await this.vehicleService.update(vehicle);
    res.status(200).json(updatedVehicle);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await this.vehicleService.delete(id);
    res.status(200).json({ status: 'success', message: 'Vehículo eliminado correctamente' });
  }
}
