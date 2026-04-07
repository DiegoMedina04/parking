import { Ticket } from './Ticket';
import { Parking } from './Parking';

export class TicketPayment {
    constructor(
        public id: string,
        public ticket: Ticket,
        public paymentDate: Date,
        public amount: number,
        public paymentMethod: string,
        public parking: Parking
    ) {}
}
