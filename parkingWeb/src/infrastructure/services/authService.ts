import { httpClient } from '../http/httpClient';
import type { User } from '../../domain/models/User';

interface LoginResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};
