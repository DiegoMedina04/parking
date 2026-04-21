import { PlanMensualidad } from '../../../models/PlanMensualidad';

export interface RetrievePlanMensualidadUseCase {
    findById(id: string): Promise<PlanMensualidad | null>;
    findAll(): Promise<PlanMensualidad[]>;
    findByParkingAndVehicleType(parkingId: string, vehicleTypeId: string): Promise<PlanMensualidad[]>;
}
