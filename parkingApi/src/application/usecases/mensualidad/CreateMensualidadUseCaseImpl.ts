import { CreateMensualidadUseCase } from '../../../domain/ports/in/mensualidad/CreateMensualidadUseCase';
import { Mensualidad, MensualidadStatus } from '../../../domain/models/Mensualidad';
import { MensualidadRepositoryPort } from '../../../domain/ports/out/MensualidadRepositoryPort';
import { FeeRepositoryPort } from '../../../domain/ports/out/FeeRepositoryPort';
import { VehicleRepositoryPort } from '../../../domain/ports/out/VehicleRepositoryPort';
import { ParkingRepositoryPort } from '../../../domain/ports/out/ParkingRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';
import { PlanMensualidad } from '../../../domain/models/PlanMensualidad';

export class CreateMensualidadUseCaseImpl implements CreateMensualidadUseCase {
    constructor(
        private readonly mensualidadRepository: MensualidadRepositoryPort,
        private readonly feeRepository: FeeRepositoryPort,
        private readonly vehicleRepository: VehicleRepositoryPort,
        private readonly parkingRepository: ParkingRepositoryPort
    ) {}

    async save(mensualidadData: any): Promise<Mensualidad> {
        const planId = mensualidadData.planId || (mensualidadData.plan && mensualidadData.plan.id);
        const vehiculoId = mensualidadData.vehiculoId || (mensualidadData.vehiculo && mensualidadData.vehiculo.id);
        const parqueaderoId = mensualidadData.parqueaderoId || (mensualidadData.parqueadero && mensualidadData.parqueadero.id);

        if (!planId) throw new NotFoundError('Plan id (fee) is required.');
        if (!vehiculoId) throw new NotFoundError('Vehicle id is required.');
        if (!parqueaderoId) throw new NotFoundError('Parking id is required.');

        // Validate Fee (Tarifa)
        const fee = await this.feeRepository.findById(planId);
        if (!fee) {
            throw new NotFoundError(`Tarifa con ID ${planId} no encontrada.`);
        }

        // Mapear Fee a PlanMensualidad para mantener compatibilidad con el modelo de Mensualidad
        const mappedPlan = new PlanMensualidad(
            fee.id,
            fee.nombre_tarifa,
            `${fee.tiempo_minutos} min`,
            fee.valor,
            fee.parqueadero_id,
            fee.tipo_vehiculo_id
        );

        // Validate Vehicle
        const vehicle = await this.vehicleRepository.findById(vehiculoId);
        if (!vehicle) {
            throw new NotFoundError(`Vehículo con ID ${vehiculoId} no encontrado.`);
        }

        // Validate Parking
        const parking = await this.parkingRepository.findById(parqueaderoId);
        if (!parking) {
            throw new NotFoundError(`Parqueadero con ID ${parqueaderoId} no encontrado.`);
        }

        // Transform and default logic
        const mensualidad = new Mensualidad(
            mensualidadData.id || '',
            mappedPlan,
            new Date(mensualidadData.fechaInicio),
            new Date(mensualidadData.fechaFin),
            mensualidadData.estado || MensualidadStatus.PENDIENTE,
            vehicle,
            parking
        );

        return this.mensualidadRepository.save(mensualidad);
    }
}
