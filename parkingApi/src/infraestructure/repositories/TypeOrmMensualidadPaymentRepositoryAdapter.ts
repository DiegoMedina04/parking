import { Between, IsNull, Not, Repository } from 'typeorm';
import { MensualidadPaymentRepositoryPort, PaymentSummaryResult } from '../../domain/ports/out/MensualidadPaymentRepositoryPort';
import { MensualidadPaymentEntity } from '../entities/MensualidadPaymentEntity';
import { AppDataSource } from '../config/DatabaseConfig';

export class TypeOrmMensualidadPaymentRepositoryAdapter implements MensualidadPaymentRepositoryPort {
    private readonly repository: Repository<MensualidadPaymentEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(MensualidadPaymentEntity);
    }

    async getPaymentSummary(
        parqueaderoId: string,
        fechaInicio?: Date,
        fechaFin?: Date
    ): Promise<PaymentSummaryResult> {
        const whereConditions: any = {
            parqueaderoId,
        };

        if (fechaInicio && fechaFin) {
            whereConditions.fechaPago = Between(fechaInicio, fechaFin);
        } else if (fechaInicio) {
            whereConditions.fechaPago = Between(fechaInicio, new Date());
        }

        const pagos = await this.repository.find({
            where: whereConditions,
            relations: ['mensualidad', 'mensualidad.vehiculo', 'mensualidad.plan'],
            order: { fechaPago: 'DESC' }
        });

        const totalRecaudado = pagos.reduce((sum, p) => sum + Number(p.valor), 0);

        return {
            totalRecaudado,
            totalTransacciones: pagos.length,
            pagos: pagos.map(p => ({
                id: p.id,
                fechaPago: p.fechaPago,
                valor: Number(p.valor),
                metodoPago: p.metodoPago,
                vehiculoPlaca: p.mensualidad?.vehiculo?.licensePlate ?? '',
                tarifaNombre: p.mensualidad?.plan?.nombre_tarifa ?? '',
            }))
        };
    }
}
