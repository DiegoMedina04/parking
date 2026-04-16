import { httpClient } from '../http/httpClient';

export interface FeeDTO {
  id?: string;
  nombre_tarifa: string;
  valor: number;
  tiempo_minutos: number;
  tipo_vehiculo_id: string;
  parqueadero_id: string;
}

export const feeService = {
  getFeesByParking: async (parqueaderoId: string) => {
    // Al pasar el parámetro en el objeto params, Axios y nuestro interceptor lo gestionan correctamente sin duplicarlos
    const response = await httpClient.get('/fee', { 
      params: { parqueadero_id: parqueaderoId } 
    });
    return response.data.data;
  },

  createFee: async (fee: FeeDTO) => {
    try {
      console.log('Enviando tarifa:', fee);
      const response = await httpClient.post('/fee', fee);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear:', error);
      throw error;
    }
  },

  updateFee: async (id: string, fee: FeeDTO) => {
    try {
      console.log('Actualizando tarifa:', id, fee);
      const response = await httpClient.put(`/fee/${id}`, fee);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar:', error);
      throw error;
    }
  },

  deleteFee: async (id: string) => {
    const response = await httpClient.delete(`/fee/${id}`);
    return response.data;
  },
};
