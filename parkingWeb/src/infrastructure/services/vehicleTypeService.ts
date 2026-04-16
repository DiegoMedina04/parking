import { httpClient } from '../http/httpClient';

export interface VehicleTypeDTO {
  id?: string;
  name: string;
}

export const vehicleTypeService = {
  getVehicleTypes: async () => {
    const response = await httpClient.get('/vehicle-type');
    if(response.status !== 200){
      return [];
    }
    return response.data.data;
  },

  saveVehicleType: async (vehicleType: VehicleTypeDTO) => {
    const response = await httpClient.post('/vehicle-type', vehicleType);
    return response.data;
  },

  updateVehicleType: async (id: string, vehicleType: VehicleTypeDTO) => {
    const response = await httpClient.put(`/vehicle-type/${id}`, vehicleType);
    return response.data;
  },

  deleteVehicleType: async (id: string) => {
    const response = await httpClient.delete(`/vehicle-type/${id}`);
    return response.data;
  },
};
