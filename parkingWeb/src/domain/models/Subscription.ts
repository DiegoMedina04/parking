import type { Plan } from './Plan';

export type SubscriptionStatus = 'ACTIVA' | 'SUSPENDIDA';

export interface ParkingShort {
  id: string;
  name: string;
  address: string;
}

export interface Subscription {
  id: string;
  parking: ParkingShort;
  plan: Plan;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
}
