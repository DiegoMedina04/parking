import { httpClient } from '../http/httpClient';
import type { Subscription, SubscriptionStatus } from '../../domain/models/Subscription';

export interface SubscriptionDTO {
  parkingId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
}

export const subscriptionService = {
  async getSubscriptions(): Promise<Subscription[]> {
    const response = await httpClient.get<Subscription[]>('/subscription');
    return response.data;
  },

  async saveSubscription(subscription: SubscriptionDTO): Promise<Subscription> {
    const response = await httpClient.post<Subscription>('/subscription', subscription);
    return response.data;
  },

  async updateSubscription(id: string, subscription: SubscriptionDTO): Promise<Subscription> {
    const response = await httpClient.put<Subscription>(`/subscription/${id}`, subscription);
    return response.data;
  },

  async deleteSubscription(id: string): Promise<void> {
    await httpClient.delete(`/subscription/${id}`);
  }
};
