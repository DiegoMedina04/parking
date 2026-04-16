import { httpClient } from '../http/httpClient';
import type { VehicleDTO } from './vehicleService';

export const TicketStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED'
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export interface TicketDTO {
  id?: string;
  vehicle: VehicleDTO;
  parking?: {
    id: string;
    name?: string;
  };
  entryDate?: string;
  exitDate?: string | null;
  status?: TicketStatus;
}

export interface CreateTicketPayload {
  licensePlate: string;
  parkingId: string;
  entryDate?: string;
  status?: TicketStatus;
}

export const ticketService = {
  getTickets: async (status?: TicketStatus) => {
    const params = status ? { status } : {};
    const response = await httpClient.get<TicketDTO[]>('/ticket', { params });
    // axios default returns response.data
    // wait, client and vehicle type API didn't return .data array directly but maybe wrapped in {data: []}
    // we saw previously `response.data.data` for others, but let's check TicketController `res.json(tickets)`
    // meaning it returns an array directly, so just response.data
    return response.data;
  },

  createTicket: async (ticket: TicketDTO) => {
    // Note: The backend expects Ticket with vehicle.id. 
    // The mapping happens in the Modal or we can do it here if needed.
    const response = await httpClient.post<TicketDTO>('/ticket', ticket);
    return response.data;
  },

  checkoutTicket: async (id: string, exitDate?: string) => {
    const payload = exitDate ? { exitDate } : {};
    const response = await httpClient.patch<TicketDTO>(`/ticket/checkout/${id}`, payload);
    return response.data;
  }
};
