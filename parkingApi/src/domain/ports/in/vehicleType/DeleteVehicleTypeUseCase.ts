export interface DeleteVehicleTypeUseCase {
    delete(id: string): Promise<void>;
}
