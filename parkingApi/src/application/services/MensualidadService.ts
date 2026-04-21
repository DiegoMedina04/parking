import { Mensualidad } from '../../domain/models/Mensualidad';
import { CreateMensualidadUseCase } from '../../domain/ports/in/mensualidad/CreateMensualidadUseCase';
import { RetrieveMensualidadUseCase } from '../../domain/ports/in/mensualidad/RetrieveMensualidadUseCase';
import { ProcessMensualidadPaymentUseCaseImpl } from '../../application/usecases/mensualidad/ProcessMensualidadPaymentUseCaseImpl';
import { GetPaymentSummaryUseCaseImpl } from '../../application/usecases/mensualidad/GetPaymentSummaryUseCaseImpl';

export class MensualidadService {
    constructor(
        private readonly createUseCase: CreateMensualidadUseCase,
        private readonly retrieveUseCase: RetrieveMensualidadUseCase,
        private readonly processPaymentUseCase: ProcessMensualidadPaymentUseCaseImpl,
        private readonly getPaymentSummaryUseCase: GetPaymentSummaryUseCaseImpl
    ) {}

    async save(mensualidad: Mensualidad): Promise<Mensualidad> {
        return this.createUseCase.save(mensualidad);
    }

    async findById(id: string): Promise<Mensualidad | null> {
        return this.retrieveUseCase.findById(id);
    }

    async findAll(): Promise<Mensualidad[]> {
        return this.retrieveUseCase.findAll();
    }

    async findAllByParking(parkingId: string): Promise<Mensualidad[]> {
        return this.retrieveUseCase.findAllByParking(parkingId);
    }

    async findByVehicleId(vehicleId: string): Promise<Mensualidad[]> {
        return this.retrieveUseCase.findByVehicleId(vehicleId);
    }

    async processPayment(paymentData: any): Promise<void> {
        return this.processPaymentUseCase.execute(paymentData);
    }

    async getPaymentSummary(parqueaderoId: string, fechaInicio?: string, fechaFin?: string) {
        return this.getPaymentSummaryUseCase.execute(parqueaderoId, fechaInicio, fechaFin);
    }
}
