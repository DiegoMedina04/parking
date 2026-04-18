import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Search,
  ArrowRight,
  CarFront,
  Bike,
  Truck,
  Bus,
  Clock,
  CreditCard,
  Wallet,
  Banknote,
  Coins,
  MapPin,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAppStore } from '../../../application/store/appStore';
import { paymentService } from '../../../infrastructure/services/paymentService';

export const PaymentsReportPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { activeParkingId, activeParkingName } = useAppStore();

  const fetchReport = async () => {
    if (!activeParkingId) return;
    try {
      setLoading(true);
      const data = await paymentService.getPaymentsReport(reportDate);
      setPayments(data);
    } catch (error) {
      toast.error('Error al cargar el reporte financiero');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeParkingId, reportDate]);

  const totalEarned = payments.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const vehicleCount = payments.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getVehicleIcon = (name?: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('moto')) return <Bike size={18} />;
    if (n.includes('camion') || n.includes('pesado')) return <Truck size={18} />;
    if (n.includes('bus')) return <Bus size={18} />;
    return <CarFront size={18} />;
  };

  const getPaymentIcon = (method?: string) => {
    const m = (method || '').toLowerCase();
    if (m.includes('efectivo')) return <Banknote size={16} />;
    if (m.includes('tarjeta')) return <CreditCard size={16} />;
    if (m.includes('nequi') || m.includes('daviplata')) return <Wallet size={16} />;
    return <DollarSign size={16} />;
  };

  if (!activeParkingId) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-16 rounded-[3rem] shadow-xl text-center space-y-6 max-w-lg border border-slate-100">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <MapPin size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Acceso Denegado</h2>
          <p className="font-bold text-slate-500">Debes seleccionar una sede activa para ver los reportes financieros.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        <PageHeader 
          title="Cierre de Caja"
          subtitle={`Historial de ingresos para ${activeParkingName}`}
          action={
            <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
               <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Consultar Fecha</span>
               </div>
               <input 
                 type="date" 
                 value={reportDate}
                 onChange={(e) => setReportDate(e.target.value)}
                 className="bg-slate-50 border-none rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all uppercase text-sm"
               />
            </div>
          }
        />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-green-500 rounded-[3rem] p-10 text-white shadow-2xl shadow-green-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 text-white/10 group-hover:scale-110 transition-transform duration-500">
                 <Coins size={120} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-3 rounded-2xl">
                       <TrendingUp size={24} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-green-100">Total Ganado Hoy</span>
                 </div>
                 <h3 className="text-5xl lg:text-6xl font-black tracking-tighter mb-2">
                    {formatCurrency(totalEarned)}
                 </h3>
                 <p className="text-green-100 font-bold">Ingresos netos registrados por liquidación</p>
              </div>
           </div>

           <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden flex items-center justify-between group">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl">
                       <CarFront size={24} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400">Vehículos Atendidos</span>
                 </div>
                 <h3 className="text-6xl font-black text-slate-800 tracking-tighter">
                    {vehicleCount}
                 </h3>
                 <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                       Transacciones
                    </span>
                 </div>
              </div>
              <div className="hidden lg:block text-slate-50/50 mr-10 scale-150">
                 <ArrowRight size={80} />
              </div>
           </div>
        </div>

        {/* Tabla de Detalles */}
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-8 lg:p-12 overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Detalle de Operaciones</h4>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Listado completo de pagos registrados</p>
              </div>
              <div className="bg-slate-50 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                 {payments.length} Registros Encontrados
              </div>
           </div>

           {loading ? (
             <div className="space-y-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="h-24 bg-slate-50 rounded-[2rem] animate-pulse" />
               ))}
             </div>
           ) : payments.length > 0 ? (
             <div className="overflow-x-auto rounded-3xl border border-slate-100">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50/50">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] first:rounded-tl-3xl">Vehículo</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Franja horaria</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Método</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right last:rounded-tr-3xl">Monto</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {payments.map((p: any) => (
                     <tr key={p.id} className="hover:bg-green-50/30 transition-colors group">
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                             <div className="bg-slate-100 px-5 py-2.5 rounded-xl border border-slate-200 font-mono font-black text-xl text-slate-700 shadow-inner group-hover:bg-white transition-colors">
                                {p.ticket?.vehicle?.licensePlate || '---'}
                             </div>
                             <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-green-600 transition-colors">
                                   {getVehicleIcon(p.ticket?.vehicle?.type?.name)}
                                   {p.ticket?.vehicle?.type?.name || 'GENÉRICO'}
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Entrada</span>
                                   <span className="font-bold text-slate-700 text-sm">
                                      {p.ticket?.entryDate ? new Date(p.ticket.entryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '---'}
                                   </span>
                                </div>
                                <ArrowRight size={14} className="text-slate-300 mt-2" />
                                <div className="flex flex-col">
                                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Salida</span>
                                   <span className="font-bold text-slate-700 text-sm">
                                      {p.ticket?.exitDate ? new Date(p.ticket.exitDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '---'}
                                   </span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl w-fit group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                             <div className="text-slate-400">
                                {getPaymentIcon(p.paymentMethod)}
                             </div>
                             <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{p.paymentMethod}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <span className="text-2xl font-black text-slate-800 tracking-tighter">
                             {formatCurrency(p.amount)}
                          </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           ) : (
             <div className="py-24 text-center flex flex-col items-center">
                <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 text-slate-300 rounded-[3rem] flex items-center justify-center mb-6">
                   <Coins size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-3">Sin Ingresos</h3>
                <p className="text-slate-500 font-bold max-w-md text-lg leading-relaxed">No se encontraron pagos registrados para la fecha seleccionada. Los ingresos aparecerán aquí a medida que se liquiden salidas.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
