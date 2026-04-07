import { VehicleType } from './VehicleType';
import { Client } from './Client';
import { Parking } from './Parking';

export class Vehicle {
    constructor(
        public id: string,
        public licensePlate: string,
        public registrationDate: Date,
        public type?: VehicleType,
        public client?: Client,
        public parking?: Parking
    ) {}
}
