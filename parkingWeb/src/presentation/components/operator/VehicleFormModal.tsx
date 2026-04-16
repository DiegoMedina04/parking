import { useState, useEffect } from 'react';
import { 
  X, 
  Car, 
  Save, 
  Loader2,
  User as UserIcon,
  CarFront
} from 'lucide-react';
import type { VehicleDTO } from '../../../infrastructure/services/vehicleService';
import { clientService, type ClientDTO } from '../../../infrastructure/services/clientService';
import { vehicleTypeService, type VehicleTypeDTO } from '../../../infrastructure/services/vehicleTypeService';
import { toast } from 'react-hot-toast';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VehicleDTO) => Promise<void>;
  selectedVehicle: VehicleDTO | null;
}

export const VehicleFormModal = ({ isOpen, onClose, onSave, selectedVehicle }: VehicleFormModalProps) => {
  const [formData, setFormData] = useState<VehicleDTO>({
    licensePlate: '',
    type: { id: '' },
    client: { id: '' }
  });
  
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [types, setTypes] = useState<VehicleTypeDTO[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoadingConfig(true);
        const [clientsData, typesData] = await Promise.all([
          clientService.getClients(),
          vehicleTypeService.getVehicleTypes()
        ]);
        setClients(clientsData);
        setTypes(typesData);
      } catch (error) {
        toast.error('Error al cargar datos necesarios');
      } finally {
        setLoadingConfig(false);
      }
    };
    if (isOpen) fetchConfig();
  }, [isOpen]);

  useEffect(() => {
    if (selectedVehicle) {
      setFormData({
        id: selectedVehicle.id,
        licensePlate: selectedVehicle.licensePlate,
        type: { id: selectedVehicle.type?.id || '' },
        client: { id: selectedVehicle.client?.id || '' }
      });
    } else {
      setFormData({
        licensePlate: '',
        type: { id: '' },
        client: { id: '' }
      });
    }
  }, [selectedVehicle, isOpen]);

  if (!isOpen) return null;

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperPlate = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setFormData({ ...formData, licensePlate: upperPlate });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type?.id || !formData.client?.id) {
       toast.error('Por favor selecciona un Cliente y un Tipo de Vehículo');
       return;
    }
    
    // Validar placa (longitud basica colombiana/internacional 5 a 6 chars)
    if (formData.licensePlate.length < 5) {
        toast.error('Placa inválida');
        return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">
                {selectedVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h3>
              <p className="text-slate-400 font-bold text-sm">Registra una placa y asóciala a un cliente.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-black text-xl"
            >
              <X size={24} />
            </button>
          </div>

          {loadingConfig ? (
             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
          ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Placa</label>
                  <div className="relative group">
                    <Car className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Ej: AAA123"
                      maxLength={7}
                      className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-black text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all text-xl"
                      value={formData.licensePlate}
                      onChange={handlePlateChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                        <span>Cliente / Dueño</span>
                     </label>
                     <div className="relative group">
                       <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                       <select
                         className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all appearance-none cursor-pointer"
                         value={formData.client?.id || ''}
                         onChange={(e) => setFormData({ ...formData, client: { id: e.target.value } })}
                         required
                       >
                          <option value="" disabled>Seleccionar...</option>
                          {clients.map(c => (
                             <option key={c.id} value={c.id}>{c.name} - {c.document}</option>
                          ))}
                       </select>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tipo Vehículo</label>
                     <div className="relative group">
                       <CarFront className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                       <select
                         className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all appearance-none cursor-pointer"
                         value={formData.type?.id || ''}
                         onChange={(e) => setFormData({ ...formData, type: { id: e.target.value } })}
                         required
                       >
                          <option value="" disabled>Seleccionar...</option>
                          {types.map(t => (
                             <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                       </select>
                     </div>
                   </div>
                </div>

                <div className="pt-4">
                   <button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] text-lg shadow-2xl shadow-blue-100 transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                     {selectedVehicle ? 'Guardar Cambios' : 'Registrar Vehículo'}
                   </button>
                </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};
