import { httpClient } from '../http/httpClient';

export interface ClientDTO {
  id?: string;
  name: string;
  document: string;
  email: string;
  phone: string;
}

export const clientService = {
  getClients: async () => {
    const response = await httpClient.get('/client');
    if(response.status !== 200){
      return [];
    }
    return response.data.data;
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
