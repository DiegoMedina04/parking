import { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Save, 
  Loader2 
} from 'lucide-react';
import type { ParkingDTO } from '../../../infrastructure/services/parkingService.ts';

interface ParkingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (parking: ParkingDTO) => Promise<void>;
  selectedParking: ParkingDTO | null;
}

export const ParkingFormModal = ({ isOpen, onClose, onSave, selectedParking }: ParkingFormModalProps) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedParking) {
      setName(selectedParking.name);
      setAddress(selectedParking.address);
    } else {
      setName('');
      setAddress('');
    }
  }, [selectedParking, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...selectedParking,
        name,
        address
      });
      onClose();
    } catch (error) {
      console.error(error);
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
      
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 lg:p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">
                {selectedParking ? 'Editar Sede' : 'Nueva Sede'}
              </h3>
              <p className="text-slate-400 font-bold">Completa la información de tu parqueadero.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
              <div className="relative group">
                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Ej: Central Park"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all placeholder:text-slate-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Exacta</label>
              <div className="relative group">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Ej: Calle 45 # 12-34"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all placeholder:text-slate-300"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] text-xl shadow-2xl shadow-blue-100 transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Save size={24} />
                  {selectedParking ? 'Guardar Cambios' : 'Crear Parqueadero'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
