import { httpClient } from '../http/httpClient';

export interface User {
  id: string;
  name: string;
  document: string;
  email: string;
  password?: string;
  role: {
    id: string;
    name: string;
  };
}

export interface UserDTO {
  name: string;
  document: string;
  email: string;
  password?: string;
  role: { id: string };
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await httpClient.get<User[]>('/user');
    return response.data;
  },

  async saveUser(user: UserDTO): Promise<User> {
    const response = await httpClient.post<User>('/user', user);
    return response.data;
  },

  async updateUser(id: string, user: UserDTO): Promise<User> {
    const response = await httpClient.put<User>(`/user/${id}`, user);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await httpClient.delete(`/user/${id}`);
  }
};
