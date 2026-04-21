import { httpClient } from '../http/httpClient';

export interface PlanMensualidadDTO {
  id?: string;
  nombre: string;
  duracion: string;
  valor: number;
  parqueadero_id: string;
  tipo_vehiculo_id: string;
}

export const MensualidadStatus = {
  PENDIENTE: 'PENDIENTE',
  PAGADA: 'PAGADA',
  VENCIDA: 'VENCIDA'
} as const;

export type MensualidadStatus = keyof typeof MensualidadStatus;

export interface MensualidadDTO {
  id?: string;
  plan: PlanMensualidadDTO;
  fechaInicio: string;
  fechaFin: string;
  estado: MensualidadStatus;
  vehiculo: {
    id: string;
    licensePlate: string;
    model?: string;
    type?: {
      id: string;
      name: string;
    }
  };
  parqueadero: {
    id: string;
  };
}

export const monthlyService = {
  // Planes mensuales (Tarifas)
  getPlans: async (parkingId: string, vehicleTypeId?: string) => {
    const response = await httpClient.get<{ status: string, data: any[] }>('/fee', {
      params: { 
        parqueadero_id: parkingId,
        tipo_vehiculo_id: vehicleTypeId 
      }
    });
    
    // Mapeamos las tarifas (fees) a la estructura que espera la UI de Mensualidades
    return response.data.data.map(f => ({
      id: f.id,
      nombre: f.nombre_tarifa,
      duracion: `${f.tiempo_minutos} min`,
      valor: Number(f.valor),
      parqueadero_id: f.parqueadero_id,
      tipo_vehiculo_id: f.tipo_vehiculo_id
    }));
  },

  // Mensualidades (Registros de clientes)
  getMensualidadesByParking: async (parkingId: string) => {
    const response = await httpClient.get<MensualidadDTO[]>('/mensualidades', {
      params: { parqueadero_id: parkingId }
    });
    return response.data;
  },

  createMensualidad: async (data: {
    vehiculoId: string;
    planId: string;
    fechaInicio: string;
    fechaFin: string;
    parqueaderoId: string;
    estado: string;
  }) => {
    const response = await httpClient.post<MensualidadDTO>('/mensualidades', data);
    return response.data;
  },

  updateStatus: async (id: string, estado: MensualidadStatus) => {
    const response = await httpClient.patch(`/mensualidades/${id}`, { estado });
    return response.data;
  },

  processPayment: async (id: string, data: { valor: number, metodoPago: string, parqueaderoId: string }) => {
    const response = await httpClient.post<{ status: string, message: string }>(`/mensualidades/${id}/pay`, data);
    return response.data;
  }
};
