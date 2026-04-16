import { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  IdCard, 
  Mail, 
  Phone, 
  Save, 
  Loader2, 
  CarFront
} from 'lucide-react';
import type { ClientDTO } from '../../../infrastructure/services/clientService';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: ClientDTO) => Promise<void>;
  selectedClient: ClientDTO | null;
}

export const ClientFormModal = ({ isOpen, onClose, onSave, selectedClient }: ClientFormModalProps) => {
  const [formData, setFormData] = useState<ClientDTO>({
    name: '',
    document: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      setFormData(selectedClient);
    } else {
      setFormData({
        name: '',
        document: '',
        email: '',
        phone: ''
      });
    }
  }, [selectedClient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent, secondaryAction = false) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
      if (secondaryAction) {
        // En el futuro, esto navegaría a la vista de "Registrar Vehículo" pasando el ID del cliente
        console.log('Navegar a Registro de Vehículo');
      }
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
      
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 lg:p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">
                {selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <p className="text-slate-400 font-bold">Información básica para identificación y contacto.</p>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cédula de Ciudadanía</label>
                <div className="relative group">
                  <IdCard className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text"
                    pattern="[0-9]*"
                    placeholder="Solo números"
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all"
                    value={formData.document}
                    onChange={(e) => setFormData({...formData, document: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Ej: 3001234567"
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-6 rounded-[2rem] text-lg shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                {selectedClient ? 'Guardar Cambios' : 'Registrar Cliente'}
              </button>
              
              {!selectedClient && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e as any, true)}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] text-lg shadow-2xl shadow-blue-100 transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <CarFront size={24} />
                  Guardar y Registrar Vehículo
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
