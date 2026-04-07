import { Subscription } from './Subscription';
import { User } from './User';

export class Parking {
    constructor(
        public id: string,
        public name: string,
        public address: string,
        public subscription?: Subscription[],
        public user?: User
    ) {}
}
