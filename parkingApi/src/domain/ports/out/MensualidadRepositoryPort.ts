import { Mensualidad } from '../../models/Mensualidad';

export interface MensualidadRepositoryPort {
    save(mensualidad: Mensualidad): Promise<Mensualidad>;
    findById(id: string): Promise<Mensualidad | null>;
    findAll(): Promise<Mensualidad[]>;
    findAllByParking(parkingId: string): Promise<Mensualidad[]>;
    findByVehicleId(vehicleId: string): Promise<Mensualidad[]>;
    delete(id: string): Promise<void>;
    processPayment(paymentData: any): Promise<void>;
}
