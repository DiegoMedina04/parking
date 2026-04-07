import { CreateMensualidadUseCase } from '../../../domain/ports/in/mensualidad/CreateMensualidadUseCase';
import { Mensualidad, MensualidadStatus } from '../../../domain/models/Mensualidad';
import { MensualidadRepositoryPort } from '../../../domain/ports/out/MensualidadRepositoryPort';
import { PlanMensualidadRepositoryPort } from '../../../domain/ports/out/PlanMensualidadRepositoryPort';
import { VehicleRepositoryPort } from '../../../domain/ports/out/VehicleRepositoryPort';
import { ParkingRepositoryPort } from '../../../domain/ports/out/ParkingRepositoryPort';
import { NotFoundError } from '../../../domain/exceptions/NotFoundError';

export class CreateMensualidadUseCaseImpl implements CreateMensualidadUseCase {
    constructor(
        private readonly mensualidadRepository: MensualidadRepositoryPort,
        private readonly planRepository: PlanMensualidadRepositoryPort,
        private readonly vehicleRepository: VehicleRepositoryPort,
        private readonly parkingRepository: ParkingRepositoryPort
    ) {}

    async save(mensualidadData: any): Promise<Mensualidad> {
        const planId = mensualidadData.planId || (mensualidadData.plan && mensualidadData.plan.id);
        const vehiculoId = mensualidadData.vehiculoId || (mensualidadData.vehiculo && mensualidadData.vehiculo.id);
        const parqueaderoId = mensualidadData.parqueaderoId || (mensualidadData.parqueadero && mensualidadData.parqueadero.id);

        if (!planId) throw new NotFoundError('Plan id is required.');
        if (!vehiculoId) throw new NotFoundError('Vehicle id is required.');
        if (!parqueaderoId) throw new NotFoundError('Parking id is required.');

        // Validate Plan
        const plan = await this.planRepository.findById(planId);
        if (!plan) {
            throw new NotFoundError(`PlanMensualidad con ID ${planId} no encontrado.`);
        }

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
            plan,
            new Date(mensualidadData.fechaInicio),
            new Date(mensualidadData.fechaFin),
            mensualidadData.estado || MensualidadStatus.PENDIENTE,
            vehicle,
            parking
        );

        return this.mensualidadRepository.save(mensualidad);
    }
}
