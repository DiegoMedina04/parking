import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  CarFront, 
  Bike, 
  Users, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ShieldCheck,
  Building2,
  BadgeAlert,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAppStore } from '../../../application/store/appStore';
import { monthlyService, type MensualidadDTO, type PlanMensualidadDTO, MensualidadStatus } from '../../../infrastructure/services/monthlyService';
import { vehicleService, type VehicleDTO } from '../../../infrastructure/services/vehicleService';

// --- Modal Component ---
const AddMensualidadModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
  const { activeParkingId } = useAppStore();
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [availablePlans, setAvailablePlans] = useState<PlanMensualidadDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  // Calcular fecha fin (Mes calendario)
  useEffect(() => {
    if (formData.startDate) {
      const date = new Date(formData.startDate);
      date.setMonth(date.getMonth() + 1);
      setFormData(prev => ({ ...prev, endDate: date.toISOString().split('T')[0] }));
    }
  }, [formData.startDate]);

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      const v = await vehicleService.getVehicles();
      setVehicles(v);
    } catch (error) {
      toast.error('Error al cargar vehículos');
    }
  };

  const handleVehicleChange = async (vid: string) => {
    const vehicle = vehicles.find(v => v.id === vid);
    setFormData(prev => ({ ...prev, vehicleId: vid, planId: '' }));
    setAvailablePlans([]);
    
    if (!vehicle) return;

    const typeId = vehicle.type?.id;
    if (typeId && activeParkingId) {
      try {
        setLoadingPlans(true);
        const plans = await monthlyService.getPlans(activeParkingId, typeId);
        setAvailablePlans(plans);
      } catch (error) {
        toast.error('Error al cargar planes');
      } finally {
        setLoadingPlans(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.planId || !activeParkingId) {
      return toast.error('Debes seleccionar un vehículo y un plan válido');
    }

    try {
      setLoading(true);
      await monthlyService.createMensualidad({
        vehiculoId: formData.vehicleId,
        planId: formData.planId,
        fechaInicio: formData.startDate,
        fechaFin: formData.endDate,
        parqueaderoId: activeParkingId,
        estado: MensualidadStatus.PENDIENTE
      });
      toast.success('Mensualidad registrada exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Error al registrar mensualidad');
    } finally {
      setLoading(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
  const selectedPlan = availablePlans.find(p => p.id === formData.planId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Nueva Mensualidad</h2>
              <p className="text-slate-400 font-bold text-sm">Registro de contrato mensual fijo.</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
              <XCircle size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Selector de Vehículo */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">1. Vehículo del Cliente</label>
                <div className="relative group">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                      <CarFront size={20} />
                   </div>
                  <select 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-16 pr-6 py-4 outline-none font-bold text-slate-700 focus:border-blue-500/20 focus:bg-white transition-all appearance-none cursor-pointer"
                    value={formData.vehicleId}
                    onChange={(e) => handleVehicleChange(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar vehículo...</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.licensePlate} - {v.client?.name || 'S/N'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selector de Tarifa Mensual */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">2. Tarifa Mensual</label>
                <div className="relative group">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-green-500 transition-colors">
                      <ShieldCheck size={20} />
                   </div>
                  <select 
                    className={`w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-16 pr-6 py-4 outline-none font-bold transition-all appearance-none ${
                        !formData.vehicleId ? 'cursor-not-allowed text-slate-300' : 'cursor-pointer text-slate-700 focus:border-green-500/20 focus:bg-white'
                    }`}
                    value={formData.planId}
                    onChange={(e) => setFormData(prev => ({ ...prev, planId: e.target.value }))}
                    disabled={!formData.vehicleId || loadingPlans}
                    required
                  >
                    {!formData.vehicleId ? (
                        <option value="">Primero selecciona un vehículo...</option>
                    ) : loadingPlans ? (
                        <option value="">Cargando tarifas...</option>
                    ) : availablePlans.length === 0 ? (
                        <option value="">No hay tarifas para este vehículo</option>
                    ) : (
                        <>
                            <option value="">Selecciona un plan mensual...</option>
                            {availablePlans.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} - ${Number(p.valor).toLocaleString()}
                                </option>
                            ))}
                        </>
                    )}
                  </select>
                </div>
                
                {/* Mensaje de Error si no hay planes */}
                {formData.vehicleId && !loadingPlans && availablePlans.length === 0 && (
                   <div className="mt-3 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                      <BadgeAlert size={16} />
                      <p className="text-[10px] font-black uppercase tracking-tight">No hay tarifas mensuales para este tipo de vehículo</p>
                   </div>
                )}
              </div>

              {/* Resumen de Pago (Visible solo si hay seleccionado un plan) */}
              {selectedPlan && (
                  <div className="bg-green-50/50 p-6 rounded-[2.5rem] border-2 border-green-100 flex items-center justify-between animate-in zoom-in-95 duration-500">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
                           <DollarSign size={24} />
                        </div>
                        <div>
                           <p className="text-green-900 font-black text-lg tracking-tight italic">{selectedPlan.nombre}</p>
                           <p className="text-green-400 font-bold text-[10px] uppercase tracking-widest">{selectedVehicle?.type?.name || 'Sede Actual'}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-black text-green-600 tracking-tighter">${Number(selectedPlan.valor).toLocaleString()}</p>
                        <p className="text-green-300 text-[10px] font-black uppercase">Monto Fijo</p>
                     </div>
                  </div>
              )}

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Fecha Inicio</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none font-bold text-slate-700 focus:border-blue-500/20 transition-all cursor-pointer"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Vencimiento (+1 Mes)</label>
                  <div className="w-full bg-slate-100 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-slate-400 flex items-center gap-3">
                     <CalendarIcon size={18} />
                     {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : '---'}
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !formData.planId}
              className={`w-full font-black py-5 rounded-[2rem] shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 text-lg uppercase tracking-tight ${
                !formData.planId 
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-slate-900 hover:bg-black text-white shadow-slate-200'
              }`}
            >
              {loading ? 'Procesando...' : <><CheckCircle2 size={24} /> Confirmar Mensualidad</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export const MensualidadesPage = () => {
  const [mensualidades, setMensualidades] = useState<MensualidadDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeParkingId, activeParkingName } = useAppStore();

  const fetchMensualidades = async () => {
    if (!activeParkingId) return;
    try {
      setLoading(true);
      const data = await monthlyService.getMensualidadesByParking(activeParkingId);
      setMensualidades(data);
    } catch (error) {
      toast.error('Error al cargar mensualidades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensualidades();
  }, [activeParkingId]);

  const getVehicleIcon = (typeName?: string) => {
    const normalized = (typeName || '').toLowerCase();
    if (normalized.includes('moto')) return <Bike size={18} />;
    return <CarFront size={18} />;
  };

  const statusMap = {
    [MensualidadStatus.PAGADA]: { label: 'Pagada', icon: <CheckCircle2 size={14} />, color: 'bg-green-100 text-green-700 border-green-200' },
    [MensualidadStatus.PENDIENTE]: { label: 'Pendiente', icon: <Clock size={14} />, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    [MensualidadStatus.VENCIDA]: { label: 'Vencida', icon: <AlertCircle size={14} />, color: 'bg-red-100 text-red-700 border-red-200' },
  };

  if (!activeParkingId) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-16 rounded-[3rem] shadow-xl text-center space-y-6 max-w-lg border border-slate-100">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <Building2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Acceso Denegado</h2>
          <p className="font-bold text-slate-500">Debes seleccionar una sede activa para gestionar mensualidades.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        <PageHeader 
          title="Mensualidades"
          subtitle={`Gestión de clientes fijos en ${activeParkingName}`}
          action={
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black px-10 py-5 rounded-[2.2rem] shadow-2xl transition-all flex items-center justify-center gap-3 transform active:scale-95 text-lg uppercase tracking-tight"
            >
              <Plus size={24} />
              Nueva Mensualidad
            </button>
          }
        />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Total Convenios</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{mensualidades.length}</h3>
                 <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                    <Users size={20} />
                 </div>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Pendientes de Pago</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-4xl font-black text-amber-600 tracking-tighter">
                   {mensualidades.filter(m => m.estado === 'PENDIENTE').length}
                 </h3>
                 <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                    <Clock size={20} />
                 </div>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Al Día</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-4xl font-black text-green-600 tracking-tighter">
                   {mensualidades.length > 0 ? Math.round((mensualidades.filter(m => m.estado === 'PAGADA').length / mensualidades.length) * 100) : 0}%
                 </h3>
                 <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} />
                 </div>
              </div>
           </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 p-8 lg:p-12 overflow-hidden">
          {loading ? (
             <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-24 bg-slate-50 rounded-[2rem] animate-pulse" />
               ))}
             </div>
          ) : mensualidades.length > 0 ? (
            <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50/50">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] first:rounded-tl-[2.5rem]">Vehículo</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tipo</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vigencia</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right last:rounded-tr-[2.5rem]">Monto</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {mensualidades.map((m) => (
                     <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group">
                       <td className="px-10 py-8">
                          <div className="flex flex-col gap-2">
                            <div className="inline-flex items-center w-fit gap-3 bg-slate-100 px-5 py-2 rounded-2xl text-slate-700 font-mono font-black tracking-widest text-lg border border-slate-200 group-hover:bg-white transition-colors">
                               {m.vehiculo?.licensePlate}
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">{m.vehiculo?.model || 'Desconocido'}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                {getVehicleIcon(m.vehiculo?.type?.name)}
                             </div>
                             <span className="font-bold text-slate-600">{m.vehiculo?.type?.name || 'Carro'}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-4 text-slate-500">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Inicio</span>
                                <span className="font-bold text-sm text-slate-700">{new Date(m.fechaInicio).toLocaleDateString()}</span>
                             </div>
                             <ChevronRight size={14} className="text-slate-200 mt-2" />
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Vence</span>
                                <span className="font-bold text-sm text-slate-700">{new Date(m.fechaFin).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-widest ${statusMap[m.estado]?.color}`}>
                             {statusMap[m.estado]?.icon}
                             {statusMap[m.estado]?.label}
                          </div>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <span className="text-xl font-black text-slate-800 tracking-tighter">
                             ${Number(m.plan?.valor).toLocaleString()}
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
                   <CalendarIcon size={48} />
                </div>
                <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-3">Sin Convenios Activos</h3>
                <p className="text-slate-500 font-bold max-w-md text-lg leading-relaxed">No hay clientes con mensualidades en este momento. Registra uno nuevo para empezar a ver datos.</p>
             </div>
          )}
        </div>
      </div>

      <AddMensualidadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMensualidades}
      />
    </div>
  );
};
