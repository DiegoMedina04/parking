import { useState, useEffect } from 'react';
import { 
  X, 
  Car, 
  CarFront,
  Ticket,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { vehicleService, type VehicleDTO } from '../../../infrastructure/services/vehicleService';
import { vehicleTypeService, type VehicleTypeDTO } from '../../../infrastructure/services/vehicleTypeService';
import { ticketService, type TicketDTO, TicketStatus } from '../../../infrastructure/services/ticketService';
import { useAppStore } from '../../../application/store/appStore';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TicketFormModal = ({ isOpen, onClose, onSuccess }: TicketFormModalProps) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [types, setTypes] = useState<VehicleTypeDTO[]>([]);
  
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { activeParkingId } = useAppStore();

  // Computed
  const existingVehicle = vehicles.find(v => v.licensePlate === licensePlate);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoadingConfig(true);
        const [vehiclesData, typesData] = await Promise.all([
          vehicleService.getVehicles(),
          vehicleTypeService.getVehicleTypes()
        ]);
        setVehicles(vehiclesData);
        setTypes(typesData);
      } catch (error) {
        toast.error('Error al cargar datos para el registro');
      } finally {
        setLoadingConfig(false);
      }
    };
    if (isOpen) {
      setLicensePlate('');
      setSelectedTypeId('');
      fetchConfig();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperPlate = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setLicensePlate(upperPlate);
    
    // Autocompletado reactivo
    const vehicle = vehicles.find(v => v.licensePlate === upperPlate);
    if (vehicle && vehicle.type?.id) {
       setSelectedTypeId(vehicle.type.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (licensePlate.length < 5) {
      toast.error('Placa inválida');
      return;
    }
    
    if (!existingVehicle && !selectedTypeId) {
       toast.error('Selecciona el tipo de vehículo para la nueva placa');
       return;
    }

    setLoading(true);
    try {
      let finalVehicle = existingVehicle;
      
      // 1. Si no existe en BD de esta terminal, lo creamos de manera Transitoria (sin dueño).
      if (!finalVehicle) {
          finalVehicle = await vehicleService.saveVehicle({
            licensePlate,
            type: { id: selectedTypeId },
            parking: { id: activeParkingId || undefined } as any
          });
      }

      // 2. Generamos el Ticket
      const ticketPayload: TicketDTO = {
          vehicle: { id: finalVehicle.id as string },
          parking: { id: activeParkingId as string },
          status: TicketStatus.OPEN,
          entryDate: new Date().toISOString()
      };
      
      await ticketService.createTicket(ticketPayload);
      toast.success('Entrada Registrada');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error al emitir el ticket';
      toast.error(msg);
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
      
      <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">
                Entrada
              </h3>
              <p className="text-slate-400 font-bold text-sm">Registra un vehículo al patio.</p>
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
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Placa Oficial</label>
                  <div className="relative group">
                    <Car className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input
                      type="text"
                      placeholder="AAA123"
                      maxLength={7}
                      className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-black text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all text-2xl tracking-[0.2em]"
                      value={licensePlate}
                      onChange={handlePlateChange}
                      required
                    />
                  </div>
                  {existingVehicle && (
                     <p className="text-xs font-bold text-green-500 flex items-center gap-1 mt-2 ml-2">
                        <CheckCircle2 size={14} /> Vehículo ya registrado ({existingVehicle.type?.name})
                     </p>
                  )}
                </div>

                {!existingVehicle && (
                   <div className="space-y-2 animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tipo Nuevo Vehículo</label>
                     <div className="relative group">
                       <CarFront className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                       <select
                         className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all appearance-none cursor-pointer text-lg"
                         value={selectedTypeId}
                         onChange={(e) => setSelectedTypeId(e.target.value)}
                         required
                       >
                          <option value="" disabled>Seleccionar...</option>
                          {types.map(t => (
                             <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                       </select>
                     </div>
                   </div>
                )}

                <div className="pt-6">
                   <button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2.5rem] text-xl shadow-2xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 uppercase italic tracking-wider"
                   >
                     {loading ? <Loader2 className="animate-spin" size={28} /> : <Ticket size={28} />}
                     Generar Ticket
                   </button>
                </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};
