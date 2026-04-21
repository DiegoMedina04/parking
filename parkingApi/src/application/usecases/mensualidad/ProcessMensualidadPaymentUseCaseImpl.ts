import { MensualidadRepositoryPort } from '../../../domain/ports/out/MensualidadRepositoryPort';

export class ProcessMensualidadPaymentUseCaseImpl {
    constructor(private readonly mensualidadRepository: MensualidadRepositoryPort) {}

    async execute(paymentData: any): Promise<void> {
        // Validaciones de negocio adicionales si fueran necesarias
        if (paymentData.valor <= 0) {
            throw new Error('El valor del pago debe ser mayor a cero');
        }

        return this.mensualidadRepository.processPayment(paymentData);
    }
}
