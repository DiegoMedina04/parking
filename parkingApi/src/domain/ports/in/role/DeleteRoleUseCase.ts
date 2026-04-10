export interface DeleteRoleUseCase {
  delete(id: string): Promise<void>;
}
