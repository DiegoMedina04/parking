import { useAuthStore } from '../../../application/store/authStore';
import { useAppStore } from '../../../application/store/appStore';
import { ParkingSelectionScreen } from './ParkingSelectionScreen';
import { 
  Building2, 
  PlusCircle, 
  ArrowRight, 
  Wallet, 
  Users, 
  CloudLightning,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../../domain/constants/roles';
import { useEffect, useState } from 'react';
import { parkingService } from '../../../infrastructure/services/parkingService';
import { monthlyService, type MensualidadDTO } from '../../../infrastructure/services/monthlyService';
import { toast } from 'react-hot-toast';
import { httpClient } from '../../../infrastructure/http/httpClient';
import { CapacityMeter } from '../../components/dashboard/CapacityMeter';



export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const activeParkingId = useAppStore((state) => state.activeParkingId);
  const navigate = useNavigate();
  const [parkingCount, setParkingCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState<MensualidadDTO[]>([]);
  const [capacity, setCapacity] = useState({ current: user?.current_places || 0, max: user?.max_places || 0 });


  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === ROLES.OPERATOR) {
        try {
          const response = await parkingService.getParkings();
          setParkingCount(response.data.length);
          
          if (activeParkingId) {
             const mData = await monthlyService.getMensualidadesByParking(activeParkingId);
             setMonthlyCount(mData.length);
             
             // Filtrar por vencer (3 días o menos)
             const now = new Date();
             const soon = mData.filter(m => {
                const endDate = new Date(m.fechaFin);
                const diffTime = endDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 3;
             });
             setExpiringSoon(soon);
          }

          // Fetch capacity
          if (activeParkingId) {
            const capResponse = await httpClient.get(`/parqueadero/${activeParkingId}/capacity`);
            if (capResponse.data.status === 'success') {
              setCapacity(capResponse.data.data);
            }
          }
        } catch (error) {
          console.error("Error fetching stats", error);
        }
      }
    };
    fetchStats();
  }, [user, activeParkingId]);

  const isAdmin = user?.role === ROLES.ADMIN;

  // Interceptar el flujo inicial si es Operador y no tiene sede
  if (user?.role === ROLES.OPERATOR && !activeParkingId) {
    return <ParkingSelectionScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header de Bienvenida */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter italic">
              ¡Hola, <span className="text-blue-600">{user?.name}</span>! 👋
            </h1>
            <p className="text-slate-400 font-bold text-lg">
              {isAdmin 
                ? 'Panel de Administración Global - ParkingPro' 
                : 'Gestiona tus sedes de manera autónoma y eficiente.'}
            </p>
          </div>
          <div className="flex gap-4">
            {!isAdmin && (
              <button 
                onClick={() => navigate('/mis-parqueaderos')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-3xl shadow-xl shadow-blue-100 transition-all flex items-center gap-3 transform active:scale-95"
              >
                <PlusCircle size={22} />
                Registrar Nueva Sede
              </button>
            )}
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <Clock size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Último Acceso</p>
                  <p className="text-sm font-black text-slate-800">Hoy, 10:24 AM</p>
               </div>
            </div>
          </div>
        </div>

        {/* Grid de Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 text-blue-500/5 group-hover:scale-110 transition-transform">
              <Building2 size={120} />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">Parqueaderos Activos</p>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-5xl font-black text-slate-800 tracking-tighter">{isAdmin ? '--' : parkingCount}</h3>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Building2 size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:scale-110 transition-transform">
              <CloudLightning size={120} />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">Tickets Hoy</p>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-5xl font-black text-slate-800 tracking-tighter">0</h3>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CloudLightning size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
             <div className="absolute -right-4 -bottom-4 text-orange-500/5 group-hover:scale-110 transition-transform">
              <Users size={120} />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">Mensualidades</p>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-5xl font-black text-slate-800 tracking-tighter">{isAdmin ? '--' : monthlyCount}</h3>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
             <div className="absolute -right-4 -bottom-4 text-purple-500/5 group-hover:scale-110 transition-transform">
              <Wallet size={120} />
            </div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">Ingresos (24h)</p>
            <div className="flex items-end justify-between relative z-10">
              <h3 className="text-5xl font-black text-slate-800 tracking-tighter">$0</h3>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Wallet size={24} />
              </div>
            </div>
          </div>

          {!isAdmin && activeParkingId && (
            <div className="lg:col-span-2">
              <CapacityMeter current={capacity.current} max={capacity.max} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
