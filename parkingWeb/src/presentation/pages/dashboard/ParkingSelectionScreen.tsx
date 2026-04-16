import { useState, useEffect } from 'react';
import { Building2, ArrowRight, MapPin } from 'lucide-react';
import { parkingService } from '../../../infrastructure/services/parkingService';
import type { ParkingDTO } from '../../../infrastructure/services/parkingService';
import { useAppStore } from '../../../application/store/appStore';
import { useAuthStore } from '../../../application/store/authStore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const ParkingSelectionScreen = () => {
  const [parkings, setParkings] = useState<ParkingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const setActiveParking = useAppStore((state) => state.setActiveParking);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const loadParkings = async () => {
      try {
        const response = await parkingService.getParkings();
        setParkings(response.data);
      } catch (error) {
        toast.error('Error al cargar parqueaderos disponibles');
      } finally {
        setLoading(false);
      }
    };
    loadParkings();
  }, []);

  const handleSelect = (parking: ParkingDTO) => {
    if (parking.id) {
      setActiveParking(parking.id, parking.name);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4 font-sans relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

      <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 group hover:scale-110 transition-transform">
          <Building2 size={36} />
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter italic">
          ¡Hola, {user?.name}! 👋
        </h1>
        <p className="text-slate-500 font-bold text-lg">
          Para comenzar tu jornada, selecciona la sede en la que vas a operar hoy.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-white/50 animate-pulse rounded-[3rem] border border-slate-100" />
            ))}
          </div>
        ) : parkings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-1000">
            {parkings.map((parking) => (
              <div 
                key={parking.id} 
                onClick={() => handleSelect(parking)}
                className="bg-white p-8 rounded-[3rem] border-2 border-transparent hover:border-blue-500 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 group-hover:scale-110 transition-all duration-500">
                  <Building2 size={120} />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-3 uppercase italic group-hover:text-blue-600 transition-colors">
                    {parking.name}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold mb-8">
                    <MapPin size={18} />
                    <span>{parking.address}</span>
                  </div>

                  <button className="flex items-center gap-3 text-blue-600 font-black tracking-widest text-sm uppercase group-hover:translate-x-2 transition-transform">
                    Ingresar
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-lg mx-auto border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-4">Sin Sedes Registradas</h2>
            <p className="text-slate-500 font-bold mb-8">
              Aún no tienes parqueaderos asignados. Por favor, registra tu primera sede.
            </p>
            <button 
              onClick={() => navigate('/mis-parqueaderos')}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-colors flex items-center justify-center w-full gap-3"
            >
              Registrar Sede <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
