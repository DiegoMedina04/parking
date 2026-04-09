import { create } from 'zustand';
import type { User } from '../../domain/models/User';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  // Inicializamos el usuario del storage si existe, para soportar un F5 (recarga de página)
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isLoggedIn: !!localStorage.getItem('token'),

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isLoggedIn: true });
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isLoggedIn: false });
  },
}));
