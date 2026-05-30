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

  signup: async (userData: any): Promise<any> => {
    const response = await httpClient.post('/auth/signup', userData);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<any> => {
    const response = await httpClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, passwordPlain: string): Promise<any> => {
    const response = await httpClient.post('/auth/reset-password', { token, password: passwordPlain });
    return response.data;
  },
};
