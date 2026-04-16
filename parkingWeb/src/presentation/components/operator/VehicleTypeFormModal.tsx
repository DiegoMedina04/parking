import { useState, useEffect } from 'react';
import { 
  X, 
  CarFront, 
  Save, 
  Loader2 
} from 'lucide-react';
import type { VehicleTypeDTO } from '../../../infrastructure/services/vehicleTypeService';

interface VehicleTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VehicleTypeDTO) => Promise<void>;
  selectedType: VehicleTypeDTO | null;
}

export const VehicleTypeFormModal = ({ isOpen, onClose, onSave, selectedType }: VehicleTypeFormModalProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedType) {
      setName(selectedType.name);
    } else {
      setName('');
    }
  }, [selectedType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...selectedType,
        name: name
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
      
      <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic uppercase">
                {selectedType ? 'Editar Tipo' : 'Nueva Categoría'}
              </h3>
              <p className="text-slate-400 font-bold text-sm">Define un nombre para el tipo de vehículo.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Categoría</label>
              <div className="relative group">
                <CarFront className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Ej: Moto, Camioneta, etc."
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] text-lg shadow-2xl shadow-blue-100 transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              {selectedType ? 'Guardar Cambios' : 'Registrar Categoría'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
