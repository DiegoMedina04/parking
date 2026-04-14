import { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Ticket
} from 'lucide-react';
import { parkingService } from '../../../infrastructure/services/parkingService';
import type { ParkingDTO } from '../../../infrastructure/services/parkingService';
import { ParkingFormModal } from '../../components/operator/ParkingFormModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const MyParkingsPage = () => {
  const [parkings, setParkings] = useState<ParkingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParking, setSelectedParking] = useState<ParkingDTO | null>(null);
  const navigate = useNavigate();

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const response = await parkingService.getParkings();
      setParkings(response.data);
    } catch (error) {
      toast.error('Error al cargar parqueaderos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  const handleSave = async (parkingData: ParkingDTO) => {
    try {
      if (selectedParking?.id) {
        await parkingService.updateParking(selectedParking.id, parkingData);
        toast.success('Parqueadero actualizado');
      } else {
        await parkingService.saveParking(parkingData);
        toast.success('Parqueadero registrado exitosamente');
      }
      fetchParkings();
    } catch (error) {
      toast.error('Error al guardar parqueadero');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este parqueadero? esta acción no se puede deshacer.')) {
      try {
        await parkingService.deleteParking(id);
        toast.success('Parqueadero eliminado');
        fetchParkings();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const filteredParkings = parkings.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
             <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-all group"
              >
               <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
               Volver al Dashboard
             </button>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter italic">
              Mis <span className="text-blue-600">Parqueaderos</span>
            </h1>
            <p className="text-slate-400 font-bold text-lg">Administra tus sedes y su capacidad instalada.</p>
          </div>
          
          <button 
            onClick={() => {
              setSelectedParking(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-[2.2rem] shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 transform active:scale-95 whitespace-nowrap"
          >
            <Plus size={24} />
            Registrar Nueva Sede
          </button>
        </div>

        {/* Stats & Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
           <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                type="text"
                placeholder="Buscar por nombre o dirección..."
                className="w-full bg-white border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 shadow-sm focus:shadow-xl focus:border-blue-100 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="bg-white px-8 py-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Sedes</p>
                 <p className="text-2xl font-black text-slate-800">{parkings.length}</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Activas</p>
                 <p className="text-2xl font-black text-emerald-500">{parkings.length}</p>
              </div>
           </div>
        </div>

        {/* Grid de Parqueaderos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white h-72 rounded-[2.5rem] border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filteredParkings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredParkings.map((parking) => (
              <div key={parking.id} className="bg-white rounded-[2.8rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
                <div className="p-8 pb-4 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <Building2 size={30} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setSelectedParking(parking);
                          setIsModalOpen(true);
                        }}
                        className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl flex items-center justify-center transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => parking.id && handleDelete(parking.id)}
                        className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2 italic uppercase">{parking.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 font-bold mb-6">
                    <MapPin size={16} />
                    <span className="text-sm">{parking.address}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Ocupación</p>
                        <div className="flex items-center gap-2">
                           <TrendingUp size={14} className="text-emerald-500" />
                           <p className="font-black text-slate-800">0%</p>
                        </div>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Tickets</p>
                        <div className="flex items-center gap-2">
                           <Ticket size={14} className="text-blue-500" />
                           <p className="font-black text-slate-800">0</p>
                        </div>
                     </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate(`/operacion`)}
                  className="w-full py-6 bg-slate-900 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-colors"
                >
                  Abrir Operación
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <Building2 size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">No tienes sedes aún</h3>
              <p className="text-slate-400 font-bold max-w-md mx-auto">
                Registra tu primer parqueadero para comenzar a gestionar el flujo de vehículos.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-5 rounded-[2rem] shadow-xl shadow-blue-100 transition-all transform active:scale-95"
            >
              Registrar Mi Primera Sede
            </button>
          </div>
        )}

      </div>

      <ParkingFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        selectedParking={selectedParking}
      />
    </div>
  );
};
