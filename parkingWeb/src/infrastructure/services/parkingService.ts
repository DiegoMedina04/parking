import { httpClient } from '../http/httpClient';

export interface ParkingDTO {
  id?: string;
  name: string;
  address: string;
  user?: { id: string };
}

export const parkingService = {
  getParkings: async () => {
    const response = await httpClient.get('/parqueadero');
    return response.data;
  },

  saveParking: async (parking: ParkingDTO) => {
    const response = await httpClient.post('/parqueadero', parking);
    return response.data;
  },

  updateParking: async (id: string, parking: ParkingDTO) => {
    const response = await httpClient.put(`/parqueadero/${id}`, parking);
    return response.data;
  },

  deleteParking: async (id: string) => {
    const response = await httpClient.delete(`/parqueadero/${id}`);
    return response.data;
  },
};
