import { Subscription } from '../../../domain/models/Subscription';

export interface SubscriptionRepositoryPort {
    findAll(): Promise<Subscription[]>;
    findById(id: string): Promise<Subscription | null>;
    findLatestActiveByParkingId(parkingId: string): Promise<Subscription | null>;
    save(subscription: Subscription): Promise<Subscription>;
    update(subscription: Subscription): Promise<Subscription>;
    delete(id: string): Promise<void>;
}
