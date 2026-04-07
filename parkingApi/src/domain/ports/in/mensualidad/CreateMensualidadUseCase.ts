import { Mensualidad } from '../../../models/Mensualidad';

export interface CreateMensualidadUseCase {
    save(mensualidad: Mensualidad): Promise<Mensualidad>;
}
