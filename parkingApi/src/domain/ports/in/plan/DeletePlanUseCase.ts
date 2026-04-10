export interface DeletePlanUseCase {
  delete(id: string): Promise<void>;
}
