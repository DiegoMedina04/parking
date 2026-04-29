import { Request, Response } from 'express';
import { ParkingService } from '../../application/services/ParkingService';
import { Parking } from '../../domain/models/Parking';
import { ROLES } from '../../domain/constants/roles';
import { SubscriptionRepositoryPort } from '../../domain/ports/out/SubscriptionRepositoryPort';
import { CapacityService } from '../../application/services/CapacityService';


export class ParkingController {
  constructor(
    private readonly parkingService: ParkingService,
    private readonly subscriptionRepository: SubscriptionRepositoryPort,
    private readonly capacityService: CapacityService
  ) {}


  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      let parkings: Parking[];

      if (user.role === ROLES.OPERATOR) {
        parkings = await this.parkingService.getParkings(user.id);
      } else {
        parkings = await this.parkingService.getParkings();
      }

      const mappedParkings = await Promise.all(
        parkings.map(async (p) => {
          let is_active = false;
          const subscription = await this.subscriptionRepository.findLatestActiveByParkingId(p.id);

          if (subscription) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            let isExpired = false;
            if (subscription.endDate) {
              const endDate = new Date(subscription.endDate);
              endDate.setHours(23, 59, 59, 999);
              if (currentDate > endDate) {
                isExpired = true;
              }
            }

            if (!isExpired) {
              is_active = true;
            }
          }

          return {
            id: p.id,
            name: p.name,
            address: p.address,
            is_active
          };
        })
      );

      res.status(200).json({ status: 'success', data: mappedParkings });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async save(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const parkingData = req.body;

      // Si es operador, vinculamos automáticamente a su ID
      if (user.role === ROLES.OPERATOR) {
        parkingData.user = { id: user.id };
      }

      const savedParking = await this.parkingService.save(parkingData);
      res.status(201).json({ status: 'success', data: savedParking });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const parking = req.body;
      const updatedParking = await this.parkingService.update(parking);
      res.status(200).json({ status: 'success', data: updatedParking });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.parkingService.delete(id);
      res.status(200).json({ status: 'success', message: 'Parqueadero eliminado correctamente' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getCapacity(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const capacity = await this.capacityService.getCapacity(id);
      res.status(200).json({ status: 'success', data: capacity });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

