import { useAuthStore } from '../../../application/store/authStore';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Parking Web - Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Hola, {user?.name || 'Usuario'}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-full flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-4">
            <span className="text-2xl font-bold">P</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido a tu panel de control!</h2>
          <p className="text-gray-500 max-w-lg">
            Estás viendo una ruta 100% protegida. Nadie puede acceder a esta interfaz sin que 
            la Parking API valide primero tu identidad y firme tu Token JWT.
          </p>
        </div>
      </main>
    </div>
  );
};
