import { httpClient } from '../http/httpClient';

export interface VehicleDTO {
  id?: string;
  licensePlate: string;
  type?: {
    id: string;
    name?: string;
  };
  client?: {
    id: string;
    name?: string;
    document?: string;
  };
  registrationDate?: string;
}

export const vehicleService = {
  getVehicles: async () => {
    const response = await httpClient.get<VehicleDTO[]>('/vehicle');
    return response.data;
  },

  saveVehicle: async (vehicle: VehicleDTO) => {
    const response = await httpClient.post<VehicleDTO>('/vehicle', vehicle);
    return response.data;
  },

  getVehicleById: async (id: string) => {
    const response = await httpClient.get<VehicleDTO>(`/vehicle/${id}`);
    return response.data;
  },

  updateVehicle: async (id: string, vehicle: VehicleDTO) => {
    const response = await httpClient.put<VehicleDTO>(`/vehicle/${id}`, vehicle);
    return response.data;
  },

  deleteVehicle: async (id: string) => {
    const response = await httpClient.delete(`/vehicle/${id}`);
    return response.data;
  }
};
