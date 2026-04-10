import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../application/store/authStore';
import type { ReactNode } from 'react';
import type { UserRole } from '../../domain/constants/roles';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { isLoggedIn, user } = useAuthStore();

  // 1. Si no está logueado, al login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay roles permitidos y el rol del usuario no está en la lista
  if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Si todo está ok, renderiza el contenido
  return children ? <>{children}</> : <Outlet />;
};
