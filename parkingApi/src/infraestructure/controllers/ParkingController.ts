import { Request, Response } from 'express';
import { ParkingService } from '../../application/services/ParkingService';
import { Parking } from '../../domain/models/Parking';

export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const parkings = await this.parkingService.getParkings();
    res.status(200).json(parkings);
  }

  async save(req: Request, res: Response): Promise<void> {
    const parking: Parking = req.body;
    const savedParking = await this.parkingService.save(parking);
    res.status(201).json(savedParking);
  }
}
