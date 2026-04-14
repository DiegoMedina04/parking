export interface DeleteParkingUseCase {
    delete(id: string): Promise<void>;
}
