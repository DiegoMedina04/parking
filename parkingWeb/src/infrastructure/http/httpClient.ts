import axios from 'axios';

// La URL base puede venir de .env en el futuro (ej. import.meta.env.VITE_API_URL)
const API_URL = 'http://localhost:8080/api';

export const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { useAppStore } from '../../application/store/appStore';

// Interceptor para inyectar token automáticamente
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Auto-inject parqueadero_id de contexto
  const activeParkingId = useAppStore.getState().activeParkingId;
  const method = config.method?.toLowerCase();

  // No inyectar en rutas públicas/de autenticación o si no hay sede
  if (activeParkingId && config.url && !config.url.includes('/auth')) {
    if (method === 'get') {
      config.params = { ...config.params, parqueadero_id: activeParkingId };
    } else if (method === 'post' || method === 'put' || method === 'patch') {
      if (config.data && typeof config.data === 'object' && !Array.isArray(config.data)) {
        config.data = { ...config.data, parqueadero_id: activeParkingId };
      } else if (!config.data) {
        config.data = { parqueadero_id: activeParkingId };
      }
    }
  }

  return config;
});

// Interceptor para atrapar respuestas no autorizadas (token expirado o faltante)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiamos token o redirigimos (opcional: zustand state clear)
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
