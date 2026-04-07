import { PlanMensualidad } from './PlanMensualidad';
import { Vehicle } from './Vehicle';
import { Parking } from './Parking';

export enum MensualidadStatus {
    PENDIENTE = 'PENDIENTE',
    PAGADA = 'PAGADA',
    VENCIDA = 'VENCIDA'
}

export class Mensualidad {
    constructor(
        public id: string,
        public plan: PlanMensualidad,
        public fechaInicio: Date,
        public fechaFin: Date,
        public estado: MensualidadStatus,
        public vehiculo: Vehicle,
        public parqueadero: Parking
    ) {}
}
