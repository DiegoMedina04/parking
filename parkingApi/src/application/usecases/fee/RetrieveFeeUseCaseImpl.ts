import { Fee } from '../../../domain/models/Fee';
import { FeeRepositoryPort } from '../../../domain/ports/out/FeeRepositoryPort';

export class RetrieveFeeUseCaseImpl {
  constructor(private readonly feeRepository: FeeRepositoryPort) {}

  async findAll(parqueadero_id?: string): Promise<Fee[]> {
    return this.feeRepository.findAll(parqueadero_id);
  }

  async findById(id: string): Promise<Fee | null> {
    return this.feeRepository.findById(id);
  }
}
