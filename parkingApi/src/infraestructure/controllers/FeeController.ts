import { Request, Response } from 'express';
import { FeeService } from '../../application/services/FeeService';
import { Fee } from '../../domain/models/Fee';

export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const feeData = req.body;
      const fee = new Fee(
        '', // ID se genera en DB
        feeData.nombre_tarifa,
        feeData.valor,
        feeData.tiempo_minutos,
        feeData.tipo_vehiculo_id,
        feeData.parqueadero_id
      );
      const createdFee = await this.feeService.createFee(fee);
      res.status(201).json({ status: 'success', data: createdFee });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { parqueadero_id } = req.query;
      
      if (!parqueadero_id || typeof parqueadero_id !== 'string') {
        res.status(400).json({ 
          status: 'error', 
          message: 'Debe proporcionar exactamente un parqueadero_id como parámetro de consulta.' 
        });
        return;
      }

      const fees = await this.feeService.getAllFees(parqueadero_id);
      res.status(200).json({ status: 'success', data: fees });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const fee = await this.feeService.getFeeById(id);
      if (!fee) {
        res.status(404).json({ status: 'error', message: 'Tarifa no encontrada' });
        return;
      }
      res.status(200).json({ status: 'success', data: fee });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const feeData = req.body;
      const fee = new Fee(
        id,
        feeData.nombre_tarifa,
        feeData.valor,
        feeData.tiempo_minutos,
        feeData.tipo_vehiculo_id,
        feeData.parqueadero_id
      );
      const updatedFee = await this.feeService.updateFee(fee);
      res.status(200).json({ status: 'success', data: updatedFee });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.feeService.deleteFee(id);
      res.status(200).json({ status: 'success', message: 'Tarifa eliminada correctamente' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
