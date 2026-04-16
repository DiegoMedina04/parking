import { FeeRepositoryPort } from '../../../domain/ports/out/FeeRepositoryPort';

export class DeleteFeeUseCaseImpl {
  constructor(private readonly feeRepository: FeeRepositoryPort) {}

  async execute(id: string): Promise<void> {
    return this.feeRepository.delete(id);
  }
}
