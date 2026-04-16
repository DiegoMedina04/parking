export interface DeleteClientUseCase {
    delete(id: string): Promise<void>;
}
