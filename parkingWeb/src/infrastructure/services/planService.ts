import { httpClient } from '../http/httpClient';
import type { Plan } from '../../domain/models/Plan';

export const planService = {
  // --- Módulo: Planes (Capacidad de Sede) ---
  async getPlanes(): Promise<Plan[]> {
    const response = await httpClient.get<Plan[]>('/plan');
    return response.data;
  },

  async savePlan(plan: Plan): Promise<Plan> {
    const response = await httpClient.post<Plan>('/plan', plan);
    return response.data;
  },

  async updatePlan(plan: Plan): Promise<Plan> {
    const response = await httpClient.put<Plan>(`/plan/${plan.id}`, plan);
    return response.data;
  },

  async deletePlan(id: string): Promise<void> {
    await httpClient.delete(`/plan/${id}`);
  }
};
