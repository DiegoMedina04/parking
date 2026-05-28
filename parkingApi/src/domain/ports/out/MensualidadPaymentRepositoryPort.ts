export interface PaymentSummaryResult {
    totalRecaudado: number;
    totalTransacciones: number;
    pagos: {
        id: string;
        fechaPago: Date;
        valor: number;
        metodoPago: string;
        vehiculoPlaca: string;
        tarifaNombre: string;
    }[];
}

export interface MensualidadPaymentRepositoryPort {
    getPaymentSummary(
        parqueaderoId: string,
        fechaInicio?: Date,
        fechaFin?: Date
    ): Promise<PaymentSummaryResult>;
}
