import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Phone, 
  Mail, 
  IdCard,
  UserPlus
} from 'lucide-react';
import { clientService } from '../../../infrastructure/services/clientService';
import type { ClientDTO } from '../../../infrastructure/services/clientService';
import { ClientFormModal } from '../../components/operator/ClientFormModal';
import { toast } from 'react-hot-toast';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAppStore } from '../../../application/store/appStore';
import { Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ClientsPage = () => {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);

  const { activeParkingId } = useAppStore();
  const navigate = useNavigate();

  const fetchClients = async () => {
    if (!activeParkingId) return;
    try {
      setLoading(true);
      const response = await clientService.getClients();
      setClients(response.data);
    } catch (error) {
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeParkingId) {
      fetchClients();
    }
  }, [activeParkingId]);

  const handleSave = async (clientData: ClientDTO) => {
    try {
      if (selectedClient?.id) {
        await clientService.updateClient(selectedClient.id, clientData);
        toast.success('Cliente actualizado correctamente');
      } else {
        await clientService.saveClient(clientData);
        toast.success('Cliente registrado con éxito');
      }
      fetchClients();
    } catch (error) {
      toast.error('Error al guardar cliente');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await clientService.deleteClient(id);
        toast.success('Cliente eliminado');
        fetchClients();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.document.includes(searchTerm)
  );

  if (!activeParkingId) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 lg:p-10 flex items-center justify-center font-sans">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-lg w-full border border-slate-100">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter">Selecciona un Parqueadero</h2>
          <p className="text-slate-500 font-bold mb-8">
            Para gestionar los clientes, primero debes seleccionar sobre qué sede vas a operar.
          </p>
          <button 
            onClick={() => navigate('/mis-parqueaderos')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-200"
          >
            Ir a Mis Parqueaderos
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        <PageHeader 
          title="Gestión de Clientes"
          subtitle="Registra y administra los dueños de los vehículos para un servicio personalizado."
          action={
            <button 
              onClick={() => {
                setSelectedClient(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-[2.2rem] shadow-2xl shadow-blue-100 transition-all flex items-center justify-center gap-3 transform active:scale-95"
            >
              <Plus size={24} />
              Nuevo Cliente
            </button>
          }
        />

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={22} />
          <input 
            type="text"
            placeholder="Buscar por cédula o nombre..."
            className="w-full bg-white border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 shadow-sm focus:shadow-xl focus:border-blue-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Clients Table / Grid */}
        <div className="bg-white rounded-[2.8rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Cliente</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Cédula</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Contacto</th>
                  <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest leading-none text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-10 py-8"><div className="h-12 bg-slate-50 rounded-2xl w-full" /></td>
                    </tr>
                  ))
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="group hover:bg-blue-50/20 transition-all">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Users size={24} />
                          </div>
                          <span className="font-black text-slate-800 text-lg tracking-tight uppercase italic italic">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                          <IdCard size={16} className="text-blue-500" />
                          {client.document}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                            <Phone size={14} className="text-slate-300" />
                            {client.phone}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                            <Mail size={14} className="text-slate-300" />
                            {client.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setSelectedClient(client);
                              setIsModalOpen(true);
                            }}
                            className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl flex items-center justify-center transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => client.id && handleDelete(client.id)}
                            className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-300">
                        <Users size={64} strokeWidth={1} />
                        <p className="font-black text-xl tracking-tighter">No se encontraron clientes</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Suggestion */}
        <div className="bg-slate-900 rounded-[2.8rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <UserPlus size={100} className="text-white" />
           </div>
           <div className="relative z-10">
              <h3 className="text-3xl font-black text-white tracking-tighter italic">¿Vehículo en fila?</h3>
              <p className="text-slate-400 font-bold mt-2">Registra al cliente y luego asocia su vehículo en segundos.</p>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="relative z-10 bg-white text-slate-900 font-black px-10 py-5 rounded-[2rem] hover:bg-blue-50 transition-all flex items-center gap-3 group"
           >
              Iniciar Flujo Rápido
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
           </button>
        </div>

      </div>

      <ClientFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        selectedClient={selectedClient}
      />
    </div>
  );
};
