import { Parking } from './Parking';
import { Plan } from './Plan';
import { SubscriptionStatus } from './SubscriptionStatus';

export class Subscription {
    constructor(
        public id: string,
        public parking: Parking,
        public plan: Plan,
        public startDate: Date,
        public endDate: Date,
        public status: SubscriptionStatus
    ) {}
}
