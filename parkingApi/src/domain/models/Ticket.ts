import { Vehicle } from './Vehicle';
import { Parking } from './Parking';

export enum TicketStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}

export class Ticket {
    constructor(
        public id: string,
        public vehicle: Vehicle,
        public parking: Parking,
        public entryDate: Date,
        public exitDate: Date | null,
        public status: TicketStatus
    ) {}
}
