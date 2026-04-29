import { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CarFront, 
  Bike, 
  Truck, 
  Bus,
  CloudLightning,
  Sparkles
} from 'lucide-react';
import { vehicleTypeService } from '../../../infrastructure/services/vehicleTypeService';
import type { VehicleTypeDTO } from '../../../infrastructure/services/vehicleTypeService';
import { VehicleTypeFormModal } from '../../components/operator/VehicleTypeFormModal';
import { toast } from 'react-hot-toast';
import { PageHeader } from '../../components/layout/PageHeader';

export const VehicleTypesPage = () => {
  const [types, setTypes] = useState<VehicleTypeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<VehicleTypeDTO | null>(null);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await vehicleTypeService.getVehicleTypes();
      setTypes(response);
    } catch (error) {
      toast.error('Error al cargar tipos de vehículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSave = async (data: VehicleTypeDTO) => {
    try {
      if (selectedType?.id) {
        await vehicleTypeService.updateVehicleType(selectedType.id, data);
        toast.success('Categoría actualizada');
      } else {
        await vehicleTypeService.saveVehicleType(data);
        toast.success('Nueva categoría registrada');
      }
      fetchTypes();
    } catch (error) {
      toast.error('Error al guardar');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await vehicleTypeService.deleteVehicleType(id);
        toast.success('Categoría eliminada');
        fetchTypes();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('moto')) return <Bike size={24} />;
    if (n.includes('camion') || n.includes('pesado')) return <Truck size={24} />;
    if (n.includes('bus')) return <Bus size={24} />;
    return <CarFront size={24} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        <PageHeader 
          title="Tipos de Vehículo"
          subtitle="Define las categorías para segmentar tus tarifas y optimizar el espacio."
          action={
            <button 
              onClick={() => {
                setSelectedType(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-[2.2rem] shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 transform active:scale-95"
            >
              <Plus size={24} />
              Agregar Categoría
            </button>
          }
        />

        {/* Grid Area */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white h-32 rounded-[2.5rem] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : types.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {types.map((type) => (
              <div key={type.id} className="relative group">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-4 group">
                   <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      {getIcon(type.name)}
                   </div>
                   <p className="font-black text-slate-800 text-sm uppercase tracking-tighter text-center">{type.name}</p>
                   
                   <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={() => {
                           setSelectedType(type);
                           setIsModalOpen(true);
                         }}
                         className="w-8 h-8 bg-white shadow-md text-slate-400 hover:text-blue-600 rounded-full flex items-center justify-center border border-slate-50 transition-all"
                      >
                         <Pencil size={14} />
                      </button>
                      <button 
                         onClick={() => type.id && handleDelete(type.id)}
                         className="w-8 h-8 bg-white shadow-md text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center border border-slate-50 transition-all"
                      >
                         <Trash2 size={14} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3.5rem] p-20 text-center space-y-8 border border-slate-100">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={48} />
            </div>
            <div className="max-w-md mx-auto space-y-4">
               <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Sin Categorías</h3>
               <p className="text-slate-400 font-bold">
                 Empieza definiendo qué tipo de vehículos permites en tu parqueadero (Carros, Motos, etc.) para luego asignarles tarifas.
               </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white font-black px-12 py-5 rounded-[2rem] hover:bg-blue-700 transition-all shadow-xl"
            >
              Crear Mi Primer Tipo
            </button>
          </div>
        )}


      </div>

      <VehicleTypeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        selectedType={selectedType}
      />
    </div>
  );
};
