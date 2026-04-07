import { Vehicle } from './Vehicle';

export enum TicketStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}

export class Ticket {
    constructor(
        public id: string,
        public vehicle: Vehicle,
        public entryDate: Date,
        public exitDate: Date | null,
        public status: TicketStatus
    ) {}
}
