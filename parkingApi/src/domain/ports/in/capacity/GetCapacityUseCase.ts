export interface GetCapacityUseCase {
    getCapacity(parkingId: string): Promise<{ current: number, max: number }>;
}
