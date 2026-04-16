import { httpClient } from '../http/httpClient';

export interface ClientDTO {
  id?: string;
  name: string;
  cedula: string;
  email: string;
  phone: string;
  parqueadero_id?: string;
}

export const clientService = {
  getClients: async (parqueadero_id?: string) => {
    const params = parqueadero_id ? { parqueadero_id } : {};
    const response = await httpClient.get('/client', { params });
    return response.data;
  },

  saveClient: async (client: ClientDTO) => {
    const response = await httpClient.post('/client', client);
    return response.data;
  },

  updateClient: async (id: string, client: ClientDTO) => {
    const response = await httpClient.put(`/client/${id}`, client);
    return response.data;
  },

  deleteClient: async (id: string) => {
    const response = await httpClient.delete(`/client/${id}`);
    return response.data;
  },
};
