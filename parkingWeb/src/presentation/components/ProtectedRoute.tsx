import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../application/store/authStore';

export const ProtectedRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    // Redirige al login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  // Renderiza los componentes hijos (rutas protegidas) si hay estado autenticado
  return <Outlet />;
};
