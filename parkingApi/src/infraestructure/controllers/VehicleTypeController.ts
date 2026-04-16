import { Request, Response } from 'express';
import { VehicleTypeService } from '../../application/services/VehicleTypeService';
import { VehicleType } from '../../domain/models/VehicleType';

export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const vehicleTypes = await this.vehicleTypeService.getVehicleTypes();
      res.status(200).json({ status: 'success', data: vehicleTypes });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async save(req: Request, res: Response): Promise<void> {
    try {
      const vehicleType: VehicleType = req.body;
      const savedVehicleType = await this.vehicleTypeService.save(vehicleType);
      res.status(201).json({ status: 'success', data: savedVehicleType });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vehicleType = await this.vehicleTypeService.findById(String(id));
      res.status(200).json({ status: 'success', data: vehicleType });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const vehicleType: VehicleType = req.body;
      const updatedVehicleType = await this.vehicleTypeService.update(vehicleType);
      res.status(200).json({ status: 'success', data: updatedVehicleType });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.vehicleTypeService.delete(id);
      res.status(200).json({ status: 'success', message: 'Tipo de vehículo eliminado correctamente' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
