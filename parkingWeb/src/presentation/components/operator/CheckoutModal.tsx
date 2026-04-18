import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Clock, 
  CreditCard, 
  Wallet, 
  Banknote,
  CarFront,
  ArrowRight
} from 'lucide-react';
import { feeService } from '../../../infrastructure/services/feeService';
import { useAuthStore } from '../../../application/store/authStore';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, paymentMethod: string) => Promise<void>;
  ticket: any;
}

const PAYMENT_METHODS = [
  { id: 'Efectivo', icon: <Banknote size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'Tarjeta', icon: <CreditCard size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'Nequi/Daviplata', icon: <Wallet size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onConfirm, ticket }) => {
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [amount, setAmount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(true);

  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (isOpen && ticket) {
      calculateTotal();
    }
  }, [isOpen, ticket]);

  const calculateTotal = async () => {
    if (!ticket) return;
    setCalculating(true);
    
    try {
      const now = new Date();
      console.log({now})
      const entry = new Date(ticket.entryDate);
      console.log({entry})
      const diffMs = now.getTime() - entry.getTime();
      const diffMins = Math.ceil(diffMs / (1000 * 60));
      
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      setElapsedTime(hrs > 0 ? `${hrs}h ${mins}m` : `${mins}min`);
      // Buscar tarifas para el tipo de vehículo
      const fees = await feeService.getFeesByParking(user?.parqueadero_id || '');
      const vehicleFees = fees.filter((f: any) => f.tipo_vehiculo_id === ticket.vehicle?.type?.id);
      
      if (vehicleFees.length > 0) {
        // Lógica simple: Buscar la tarifa que mejor se ajuste o usar la base
        // Por ahora: Tomar la de menor tiempo como base y multiplicar
        const baseFee = vehicleFees.sort((a: any, b: any) => a.tiempo_minutos - b.tiempo_minutos)[0];
        const costPerMinute = baseFee.valor / baseFee.tiempo_minutos;

        setAmount(Math.ceil(diffMins * costPerMinute));
      } else {
        setAmount(0); // O un valor por defecto
      }
    } catch (error) {
      console.error('Error calculating total', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(amount, paymentMethod);
      onClose();
    } catch (error) {
      // Error handled by parent toast
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-50 p-8 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-4">
             <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <DollarSign size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Liquidar Salida</h2>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resumen de cobro y pago</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all hover:shadow-sm">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Resumen del Vehículo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Placa</span>
               <div className="flex items-center gap-2">
                 <div className="bg-white px-3 py-1 rounded-lg border-2 border-slate-200 font-mono font-black text-xl text-slate-800 shadow-inner">
                    {ticket.vehicle?.licensePlate}
                 </div>
               </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Tiempo</span>
               <div className="flex items-center gap-2 text-slate-800">
                 <Clock size={20} className="text-indigo-500" />
                 <span className="text-xl font-black">{elapsedTime}</span>
               </div>
            </div>
          </div>

          {/* Valor Principal */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-center shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            <span className="text-indigo-200 text-xs font-black uppercase tracking-[0.3em] mb-2 block relative z-10">Total a Pagar</span>
            {calculating ? (
              <div className="h-10 w-32 bg-indigo-500 rounded-full animate-pulse mx-auto relative z-10" />
            ) : (
              <h3 className="text-5xl font-black text-white tracking-tighter relative z-10">
                ${amount.toLocaleString('es-CO')}
              </h3>
            )}
            <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
               <div className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <CarFront size={12} /> {ticket.vehicle?.type?.name || 'Tarifa Estándar'}
               </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="space-y-4">
             <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Método de Pago</span>
             <div className="grid grid-cols-3 gap-3">
               {PAYMENT_METHODS.map((method) => (
                 <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`
                      flex flex-col items-center justify-center gap-3 p-4 rounded-[2rem] border-2 transition-all group
                      ${paymentMethod === method.id 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-105' 
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}
                    `}
                 >
                   <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${paymentMethod === method.id ? 'bg-indigo-600 text-white' : `${method.bg} ${method.color}`}`}>
                      {method.icon}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-tight ${paymentMethod === method.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {method.id}
                   </span>
                 </button>
               ))}
             </div>
          </div>

          {/* Botón de Acción */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || calculating}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2.2rem] shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Registrar Pago y Salida
                  <ArrowRight size={22} />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-10 leading-relaxed">
            Al confirmar, el vehículo quedará liberado de la sede y se generará el comprobante de pago electrónico.
          </p>
        </form>
      </div>
    </div>
  );
};
