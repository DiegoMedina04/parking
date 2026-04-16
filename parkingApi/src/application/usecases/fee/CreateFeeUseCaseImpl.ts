import { Fee } from '../../../domain/models/Fee';
import { FeeRepositoryPort } from '../../../domain/ports/out/FeeRepositoryPort';

export class CreateFeeUseCaseImpl {
  constructor(private readonly feeRepository: FeeRepositoryPort) {}

  async execute(fee: Fee): Promise<Fee> {
    const isDuplicate = await this.feeRepository.findDuplicate(
      fee.nombre_tarifa,
      fee.tiempo_minutos,
      fee.tipo_vehiculo_id,
      fee.parqueadero_id
    );

    if (isDuplicate) {
      throw new Error(`Ya existe una tarifa con el nombre "${fee.nombre_tarifa}" y tiempo "${fee.tiempo_minutos} min" para este vehículo en esta sede.`);
    }

    return this.feeRepository.save(fee);
  }
}
