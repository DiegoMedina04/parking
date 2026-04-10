import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 animate-pulse">
            <ShieldAlert size={48} />
          </div>
          <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full border-2 border-red-500">
            <div className="bg-red-500 w-3 h-3 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Acceso Denegado</h1>
          <p className="text-gray-500 text-lg">
            No tienes los permisos necesarios para acceder a esta sección.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 italic">
            "Esta zona está reservada exclusivamente para personal administrativo."
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-200"
        >
          <ArrowLeft size={18} />
          Volver Atrás
        </button>
      </div>
    </div>
  );
};
