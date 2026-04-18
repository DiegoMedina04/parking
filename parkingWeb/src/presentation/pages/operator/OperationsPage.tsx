import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MapPin,
  Clock,
  CarFront,
  Bike,
  Truck,
  Bus,
  CheckCircle2,
  Ticket
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAppStore } from '../../../application/store/appStore';
import { ticketService, type TicketDTO, TicketStatus } from '../../../infrastructure/services/ticketService';
import { TicketFormModal } from '../../components/operator/TicketFormModal';
import { CheckoutModal } from '../../components/operator/CheckoutModal';

// Hook para el cronómetro en vivo
const ElapsedTime = ({ entryDate }: { entryDate: string }) => {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const entry = new Date(entryDate);
      const diffMs = now.getTime() - entry.getTime();
      
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHrs > 0) {
        setElapsed(`${diffHrs}h ${diffMins}m`);
      } else {
        setElapsed(`${diffMins}m`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, [entryDate]);

  return <span className="font-black text-slate-700">{elapsed}</span>;
};

export const OperationsPage = () => {
  const [tickets, setTickets] = useState<TicketDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketDTO | null>(null);
  
  const { activeParkingId, activeParkingName } = useAppStore();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Fetcheamos solo abiertos usando enum
      const data = await ticketService.getTickets(TicketStatus.OPEN);
      setTickets(data);
    } catch (error) {
      toast.error('Error al cargar patio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeParkingId) {
       fetchTickets();
    }
  }, [activeParkingId]);

  const handleOpenCheckout = (ticket: TicketDTO) => {
    setSelectedTicket(ticket);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = async (amount: number, paymentMethod: string) => {
    if (!selectedTicket?.id) return;
    
    try {
      await ticketService.checkoutTicket(
        selectedTicket.id, 
        amount, 
        paymentMethod, 
        new Date().toISOString()
      );
      toast.success(`Pago registrado: ${selectedTicket.vehicle?.licensePlate}`);
      fetchTickets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al procesar salida');
      throw error; // Propagar para que el modal maneje el loading
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="font-bold text-slate-500">Debes seleccionar una sede activa para operar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        <PageHeader 
          title="Patio Activo"
          subtitle={activeParkingName ? `Gestionando: ${activeParkingName}` : 'Panel de operación general.'}
          action={
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-black px-10 py-5 rounded-[2.2rem] shadow-2xl shadow-green-100 transition-all flex items-center justify-center gap-3 transform active:scale-95 text-lg uppercase tracking-tight"
            >
              <Plus size={24} />
              Registrar Entrada
            </button>
          }
        />

        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-8 lg:p-12">
          {/* Buscador y Metrica rapida */}
          <div className="flex flex-col md:flex-row gap-6 mb-10 justify-between items-center">
            <div className="relative w-full md:w-1/2 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Escanea o busca placas en patio..."
                className="w-full bg-slate-50 border-2 border-transparent rounded-[2.5rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 hover:bg-slate-100 focus:bg-white focus:border-blue-100 focus:shadow-md transition-all text-xl uppercase"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-blue-50 px-8 py-4 rounded-[2rem] border border-blue-100 flex items-center gap-4 shadow-inner">
               <span className="text-blue-400 font-bold text-sm uppercase tracking-widest">Ocupación Vivos</span>
               <span className="text-3xl font-black text-blue-600">{tickets.length}</span>
            </div>
          </div>

          {/* Tabla de Patio */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-slate-50 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest first:rounded-tl-[2.5rem]">Placa</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Tiempo / Entrada</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Estado</th>
                    <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right last:rounded-tr-[2.5rem]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-10 py-8">
                         <div className="flex flex-col gap-2">
                           <div className="inline-flex items-center w-fit gap-3 bg-slate-100 px-6 py-3 rounded-2xl text-slate-800 font-mono font-black tracking-[0.2em] text-2xl border-2 border-slate-200 shadow-inner">
                              {ticket.vehicle?.licensePlate}
                           </div>
                           <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tight">
                              {getVehicleIcon(ticket.vehicle?.type?.name)}
                              {ticket.vehicle?.type?.name || 'GENÉRICO'}
                           </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2 bg-blue-50 w-fit px-3 py-1.5 rounded-lg text-blue-600 mb-1">
                              <Clock size={16} />
                              {ticket.entryDate ? <ElapsedTime entryDate={ticket.entryDate} /> : '---'}
                           </div>
                           <p className="text-xs font-bold text-slate-400 pl-1 uppercase">
                              {ticket.entryDate ? new Date(ticket.entryDate).toLocaleTimeString() : '---'}
                           </p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-2 bg-green-50 text-green-600 w-fit px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest border border-green-200">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {ticket.status}
                         </div>
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleOpenCheckout(ticket)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-4 rounded-3xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 inline-flex items-center gap-2"
                        >
                          Cerrar Ticket <CheckCircle2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="py-24 text-center flex flex-col items-center">
                <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 text-slate-300 rounded-[3rem] flex items-center justify-center mb-6">
                   <Ticket size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-3">Patio Vacío</h3>
                <p className="text-slate-500 font-bold max-w-md text-lg leading-relaxed">No hay vehículos transitorios dentro de la sede. Escanea o digita una placa para dar el primer ingreso del día.</p>
             </div>
          )}
        </div>
      </div>

      <TicketFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTickets}
      />

      {selectedTicket && (
        <CheckoutModal 
          isOpen={isCheckoutModalOpen}
          onClose={() => {
            setIsCheckoutModalOpen(false);
            setSelectedTicket(null);
          }}
          onConfirm={handleConfirmCheckout}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};
