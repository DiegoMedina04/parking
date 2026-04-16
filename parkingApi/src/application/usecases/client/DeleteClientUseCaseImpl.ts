import { DeleteClientUseCase } from '../../../domain/ports/in/client/DeleteClientUseCase';
import { ClientRepositoryPort } from '../../../domain/ports/out/ClientRepositoryPort';

export class DeleteClientUseCaseImpl implements DeleteClientUseCase {
  constructor(private readonly clientRepositoryPort: ClientRepositoryPort) {}

  async delete(id: string): Promise<void> {
    return this.clientRepositoryPort.delete(id);
  }
}
