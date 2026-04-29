import { GetCapacityUseCase } from '../../../domain/ports/in/capacity/GetCapacityUseCase';
import { TicketRepositoryPort } from '../../../domain/ports/out/TicketRepositoryPort';
import { MensualidadRepositoryPort } from '../../../domain/ports/out/MensualidadRepositoryPort';
import { ParkingRepositoryPort } from '../../../domain/ports/out/ParkingRepositoryPort';
import { TicketStatus } from '../../../domain/models/Ticket';
import { MensualidadStatus } from '../../../domain/models/Mensualidad';
import { SubscriptionStatus } from '../../../domain/models/SubscriptionStatus';

export class GetCapacityUseCaseImpl implements GetCapacityUseCase {
    constructor(
        private readonly ticketRepository: TicketRepositoryPort,
        private readonly mensualidadRepository: MensualidadRepositoryPort,
        private readonly parkingRepository: ParkingRepositoryPort
    ) { }

    async getCapacity(parkingId: string): Promise<{ current: number, max: number }> {
        // 1. Get Open Tickets
        const openTickets = await this.ticketRepository.findAll(TicketStatus.OPEN, parkingId);
        const ticketCount = openTickets.length;

        // 2. Get Active Monthly Payments
        const mensualidades = await this.mensualidadRepository.findAllByParking(parkingId);
        const now = new Date();
        const activeMensualidadesCount = mensualidades.filter(m =>
            m.estado === MensualidadStatus.PAGADA &&
            new Date(m.fechaInicio) <= now &&
            new Date(m.fechaFin) >= now
        ).length;

        // 3. Get Max Capacity from Parking Plan
        console.log({ parkingId });
        const parking = await this.parkingRepository.findById(parkingId);
        let max = 0;
        console.log({ parking });
        if (parking && parking.subscription && parking.subscription.length > 0) {

            const activeSub = parking.subscription.find(s => s.status === SubscriptionStatus.ACTIVA);
            console.log({ activeSub });

            if (activeSub && activeSub.plan) {
                max = activeSub.plan.maxPlaces;
            } else {
                max = parking.subscription[0].plan.maxPlaces;
            }
        }
        console.log('retornando');
        return {
            current: ticketCount + activeMensualidadesCount,
            max: max
        };
    }
}
