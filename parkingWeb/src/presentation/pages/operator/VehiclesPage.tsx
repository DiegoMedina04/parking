import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Car, 
  Calendar,
  User as UserIcon,
  Pencil,
  Trash2,
  CarFront,
  Bike,
  Truck,
  Bus,
  MapPin
} from 'lucide-react';
import { vehicleService, type VehicleDTO } from '../../../infrastructure/services/vehicleService';
import { VehicleFormModal } from '../../components/operator/VehicleFormModal';
import { toast } from 'react-hot-toast';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAppStore } from '../../../application/store/appStore';

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDTO | null>(null);
  
  const { activeParkingId } = useAppStore();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (error) {
      toast.error('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [activeParkingId]);

  const handleSave = async (data: VehicleDTO) => {
    try {
      if (selectedVehicle?.id) {
         await vehicleService.updateVehicle(selectedVehicle.id, data);
      } else {
         await vehicleService.saveVehicle(data);
      }
      toast.success(selectedVehicle ? 'Vehículo actualizado correctamente' : 'Vehículo registrado');
      fetchVehicles();
    } catch (error) {
      throw error; // El modal captura y muestra toast genérico si hace falta, o el error interceptor.
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar el vehículo con este ID? Esta acción es irreversible.')) {
       try {
         await vehicleService.deleteVehicle(id);
         toast.success('Vehículo eliminado con éxito');
         fetchVehicles();
       } catch (error: any) {
         // El interceptor atrapará el error 400 del constraint y mostrará toast de error.
       }
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.client?.document && v.client.document.includes(searchTerm))
  );

  const getVehicleIcon = (name?: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('moto')) return <Bike size={18} />;
    if (n.includes('camion') || n.includes('pesado')) return <Truck size={18} />;
    if (n.includes('bus')) return <Bus size={18} />;
    return <CarFront size={18} />;
  };

  if (!activeParkingId) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-16 rounded-[3rem] shadow-xl text-center space-y-6 max-w-lg border border-slate-100">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <MapPin size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Acceso Denegado</h2>
          <p className="font-bold text-slate-500">Debes seleccionar una sede activa para gestionar vehículos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        <PageHeader 
          title="Vehículos"
          subtitle="Lista maestra de vehículos asociados a los clientes de tu Sede."
          action={
            <button 
              onClick={() => {
                setSelectedVehicle(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-[2.2rem] shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 transform active:scale-95"
            >
              <Plus size={24} />
              Registrar Vehículo
            </button>
          }
        />

        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-8 lg:p-12">
          {/* Buscador */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Buscar por placa o cédula del dueño..."
                className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 hover:bg-slate-100 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-slate-50 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest first:rounded-tl-[2.5rem]">Placa</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Dueño</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Registro</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right last:rounded-tr-[2.5rem]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredVehicles.map(vehicle => (
                    <tr key={vehicle.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-10 py-8">
                         <div className="inline-flex items-center gap-3 bg-slate-100 px-5 py-2 rounded-xl text-slate-800 font-black tracking-widest text-lg border-2 border-slate-200">
                            {vehicle.licensePlate}
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black shadow-sm">
                            <UserIcon size={18} />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 tracking-tighter">{vehicle.client?.name || '---'}</p>
                            <p className="text-sm font-bold text-slate-400">CC: {vehicle.client?.document || '---'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-3 bg-blue-50/50 text-blue-600 w-fit px-4 py-2 rounded-2xl font-black text-sm uppercase tracking-tight">
                            {getVehicleIcon(vehicle.type?.name)}
                            {vehicle.type?.name || '---'}
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                          <Calendar size={18} className="text-blue-500" />
                          {vehicle.registrationDate ? new Date(vehicle.registrationDate).toLocaleDateString() : '---'}
                        </div>
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setIsModalOpen(true);
                            }}
                            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all border border-slate-100 shadow-sm"
                            title="Editar Vehículo"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => vehicle.id && handleDelete(vehicle.id)}
                            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all border border-slate-100 shadow-sm"
                            title="Eliminar Vehículo"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="py-20 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                   <Car size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">Sin Resultados</h3>
                <p className="text-slate-500 font-bold max-w-md">No encontramos vehículos registrados en esta sede que coincidan con tu búsqueda.</p>
             </div>
          )}
        </div>
      </div>

      <VehicleFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        selectedVehicle={selectedVehicle}
      />
    </div>
  );
};
