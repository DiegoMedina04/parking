import { GetCapacityUseCase } from '../../domain/ports/in/capacity/GetCapacityUseCase';

export class CapacityService implements GetCapacityUseCase {
    constructor(private readonly getCapacityUseCase: GetCapacityUseCase) {}

    async getCapacity(parkingId: string): Promise<{ current: number, max: number }> {
        return this.getCapacityUseCase.getCapacity(parkingId);
    }
}
