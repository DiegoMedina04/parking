import { Fee } from '../../models/Fee';

export interface FeeRepositoryPort {
  findAll(parqueadero_id?: string, tipo_vehiculo_id?: string): Promise<Fee[]>;
  findById(id: string): Promise<Fee | null>;
  findDuplicate(
    nombre_tarifa: string,
    tiempo_minutos: number,
    tipo_vehiculo_id: string,
    parqueadero_id: string,
    excludeId?: string
  ): Promise<Fee | null>;
  save(fee: Fee): Promise<Fee>;
  update(fee: Fee): Promise<Fee>;
  delete(id: string): Promise<void>;
}
