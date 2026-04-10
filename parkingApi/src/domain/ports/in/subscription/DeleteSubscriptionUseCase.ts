export interface DeleteSubscriptionUseCase {
  delete(id: string): Promise<void>;
}
