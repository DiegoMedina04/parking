import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './presentation/pages/auth/LoginPage';
import { DashboardPage } from './presentation/pages/dashboard/DashboardPage';
import { UnauthorizedPage } from './presentation/pages/error/UnauthorizedPage';
import { ProtectedRoute } from './presentation/components/ProtectedRoute';
import { PlaceholderPage } from './presentation/pages/PlaceholderPages';
import { PlansPage } from './presentation/pages/admin/PlansPage';
import { MainLayout } from './presentation/components/layout/MainLayout';
import { useAuthStore } from './application/store/authStore';
import { ROLES } from './domain/constants/roles';
import type { ReactNode } from 'react';

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rutas Protegidas Envueltas en Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Rutas para ADMIN y OPERATOR */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.OPERATOR]} />}>
            <Route path="/operacion" element={<PlaceholderPage title="Control de Tickets" />} />
            <Route path="/clientes" element={<PlaceholderPage title="Gestión de Clientes" />} />
          </Route>

          {/* Rutas Solo ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/planes" element={<PlansPage />} />
            <Route path="/usuarios" element={<PlaceholderPage title="Gestión de Usuarios" />} />
            <Route path="/parqueaderos" element={<PlaceholderPage title="Gestión de Parqueaderos" />} />
            <Route path="/mensualidades" element={<PlaceholderPage title="Gestión de Mensualidades" />} />
            <Route path="/reportes" element={<PlaceholderPage title="Reportes y Métricas" />} />
            <Route path="/configuracion" element={<PlaceholderPage title="Configuración del Sistema" />} />
          </Route>
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
