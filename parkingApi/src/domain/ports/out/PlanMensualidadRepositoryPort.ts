import { PlanMensualidad } from '../../models/PlanMensualidad';

export interface PlanMensualidadRepositoryPort {
    save(plan: PlanMensualidad): Promise<PlanMensualidad>;
    findById(id: string): Promise<PlanMensualidad | null>;
    findAll(): Promise<PlanMensualidad[]>;
    findByParkingAndVehicleType(parkingId: string, vehicleTypeId: string): Promise<PlanMensualidad[]>;
    delete(id: string): Promise<void>;
}
