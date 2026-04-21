import { MensualidadPaymentRepositoryPort, PaymentSummaryResult } from '../../../domain/ports/out/MensualidadPaymentRepositoryPort';

export class GetPaymentSummaryUseCaseImpl {
    constructor(
        private readonly paymentRepository: MensualidadPaymentRepositoryPort
    ) {}

    async execute(
        parqueaderoId: string,
        fechaInicio?: string,
        fechaFin?: string
    ): Promise<PaymentSummaryResult> {
        const start = fechaInicio ? new Date(fechaInicio) : undefined;
        let end: Date | undefined;

        if (fechaFin) {
            end = new Date(fechaFin);
            end.setHours(23, 59, 59, 999); // Include the full end day
        }

        return this.paymentRepository.getPaymentSummary(parqueaderoId, start, end);
    }
}
