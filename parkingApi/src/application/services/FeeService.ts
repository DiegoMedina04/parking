import { Fee } from '../../domain/models/Fee';
import { CreateFeeUseCaseImpl } from '../usecases/fee/CreateFeeUseCaseImpl';
import { RetrieveFeeUseCaseImpl } from '../usecases/fee/RetrieveFeeUseCaseImpl';
import { UpdateFeeUseCaseImpl } from '../usecases/fee/UpdateFeeUseCaseImpl';
import { DeleteFeeUseCaseImpl } from '../usecases/fee/DeleteFeeUseCaseImpl';

export class FeeService {
  constructor(
    private readonly createFeeUseCase: CreateFeeUseCaseImpl,
    private readonly retrieveFeeUseCase: RetrieveFeeUseCaseImpl,
    private readonly updateFeeUseCase: UpdateFeeUseCaseImpl,
    private readonly deleteFeeUseCase: DeleteFeeUseCaseImpl
  ) {}

  async createFee(fee: Fee): Promise<Fee> {
    return this.createFeeUseCase.execute(fee);
  }

  async getAllFees(parqueadero_id?: string): Promise<Fee[]> {
    return this.retrieveFeeUseCase.findAll(parqueadero_id);
  }

  async getFeeById(id: string): Promise<Fee | null> {
    return this.retrieveFeeUseCase.findById(id);
  }

  async updateFee(fee: Fee): Promise<Fee> {
    return this.updateFeeUseCase.execute(fee);
  }

  async deleteFee(id: string): Promise<void> {
    return this.deleteFeeUseCase.execute(id);
  }
}
