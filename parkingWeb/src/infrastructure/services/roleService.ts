import { httpClient } from '../http/httpClient';

export interface Role {
  id: string;
  name: string;
}

export const roleService = {
  async getRoles(): Promise<Role[]> {
    const response = await httpClient.get<Role[]>('/role');
    return response.data;
  },

  async saveRole(role: Partial<Role>): Promise<Role> {
    const response = await httpClient.post<Role>('/role', role);
    return response.data;
  },

  async updateRole(id: string, role: Partial<Role>): Promise<Role> {
    const response = await httpClient.put<Role>(`/role/${id}`, role);
    return response.data;
  },

  async deleteRole(id: string): Promise<void> {
    await httpClient.delete(`/role/${id}`);
  }
};
