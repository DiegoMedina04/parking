import { Subscription } from './Subscription';

export class Plan {
    constructor(
        public id: string,
        public name: string,
        public maxPlaces: number,
        public monthlyValue: number,
        public subscriptions?: Subscription[]
    ) {}
}
