import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Layers, 
  ToggleLeft, 
  ToggleRight, 
  Trash2, 
  X, 
  AlertCircle,
  Clock,
  CalendarDays
} from 'lucide-react';
import { subscriptionService, type SubscriptionDTO } from '../../../infrastructure/services/subscriptionService';
import { planService } from '../../../infrastructure/services/planService';
import { PageHeader } from '../../components/layout/PageHeader';
import type { Subscription, SubscriptionStatus } from '../../../domain/models/Subscription';
import type { Plan } from '../../../domain/models/Plan';

// Note: Assuming a parking service exists or we can use a generic endpoint
// I'll define a quick fetch for parkings if needed, or assume it's available via another service.
// For now, I'll mock the parking list if I can't find the service.
import { httpClient } from '../../../infrastructure/http/httpClient';

export const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [parkings, setParkings] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<SubscriptionDTO>({
    parkingId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'ACTIVA' as SubscriptionStatus
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [subsRes, plansRes, parkingsRes] = await Promise.all([
        subscriptionService.getSubscriptions(),
        planService.getPlanes(),
        httpClient.get<any[]>('/parking') // Direct call to avoid missing service
      ]);
      setSubscriptions(subsRes);
      setPlans(plansRes);
      setParkings(parkingsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sub?: Subscription) => {
    if (sub) {
      setSelectedSub(sub);
      setFormData({
        parkingId: sub.parking.id,
        planId: sub.plan.id,
        startDate: new Date(sub.startDate).toISOString().split('T')[0],
        endDate: sub.endDate ? new Date(sub.endDate).toISOString().split('T')[0] : '',
        status: sub.status
      });
    } else {
      setSelectedSub(null);
      setFormData({
        parkingId: '',
        planId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'ACTIVA'
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSub) {
        await subscriptionService.updateSubscription(selectedSub.id, formData);
      } else {
        await subscriptionService.saveSubscription(formData);
      }
      setShowModal(false);
      fetchInitialData();
    } catch (error) {
      alert('Error al guardar la suscripción');
    }
  };

  const toggleStatus = async (sub: Subscription) => {
    const newStatus: SubscriptionStatus = sub.status === 'ACTIVA' ? 'SUSPENDIDA' : 'ACTIVA';
    try {
      await subscriptionService.updateSubscription(sub.id, {
        parkingId: sub.parking.id,
        planId: sub.plan.id,
        startDate: sub.startDate.toString(),
        endDate: sub.endDate?.toString() || '',
        status: newStatus
      });
      fetchInitialData();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta suscripción?')) return;
    try {
      await subscriptionService.deleteSubscription(id);
      fetchInitialData();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen font-sans animate-in fade-in duration-700 pb-20">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="Gestión de Suscripciones" 
          subtitle="Vincula parqueaderos con planes de capacidad y controla sus vigencias."
          action={
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[2rem] font-black shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              <Plus size={24} />
              Emitir Nueva Suscripción
            </button>
          }
        />

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Parqueadero / Ubicación</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Plan Asignado</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Vigencia</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="group hover:bg-blue-50/20 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-lg leading-none">{sub.parking.name}</p>
                        <p className="text-slate-400 text-sm mt-1.5 font-medium">{sub.parking.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                      <Layers size={16} className="text-blue-500" />
                      <span className="font-bold text-slate-700 text-sm">{sub.plan.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <Clock size={14} className="text-blue-400" />
                        <span>Desde: {formatDate(sub.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-medium text-[13px]">
                        <CalendarDays size={14} />
                        <span>Hasta: {sub.endDate ? formatDate(sub.endDate) : 'Indefinido'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`
                      inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-sm
                      ${sub.status === 'ACTIVA' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'}
                    `}>
                      <div className={`w-2 h-2 rounded-full ${sub.status === 'ACTIVA' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => toggleStatus(sub)}
                        className={`p-3 rounded-2xl transition-all shadow-sm ${sub.status === 'ACTIVA' ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'}`}
                        title={sub.status === 'ACTIVA' ? 'Suspender' : 'Activar'}
                      >
                        {sub.status === 'ACTIVA' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                      <button 
                         onClick={() => handleOpenModal(sub)}
                         className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all shadow-sm border border-slate-100"
                         title="Editar"
                      >
                        <Calendar size={22} />
                      </button>
                      <button 
                        onClick={() => handleDelete(sub.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-slate-100"
                        title="Eliminar"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subscriptions.length === 0 && !loading && (
                <tr>
                   <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-6 opacity-20">
                        <Layers size={80} strokeWidth={1} />
                        <p className="font-black text-2xl tracking-tight">No hay suscripciones activas</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && (
             <div className="flex items-center justify-center p-32">
               <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
          )}
        </div>
      </div>

      {/* Modal Premium */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-12 pb-6 flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
                  {selectedSub ? 'Ajustar Suscripción' : 'Nueva Suscripción'}
                </h2>
                <p className="text-slate-500 font-bold mt-2">Asigna el poder de gestión a una sede específica.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-slate-50 p-4 rounded-3xl text-slate-300 hover:text-slate-600 transition-all hover:rotate-90"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-12 pt-6 space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Seleccionar Parqueadero</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-3xl px-8 py-5 outline-none text-slate-700 font-black transition-all appearance-none cursor-pointer"
                    value={formData.parkingId}
                    onChange={(e) => setFormData({...formData, parkingId: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {parkings.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Plan de Capacidad</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-3xl px-8 py-5 outline-none text-slate-700 font-black transition-all appearance-none cursor-pointer"
                    value={formData.planId}
                    onChange={(e) => setFormData({...formData, planId: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Inicio</label>
                  <input 
                    type="date" required
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-3xl px-8 py-5 outline-none text-slate-700 font-black transition-all"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Fin (Opcional)</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-3xl px-8 py-5 outline-none text-slate-700 font-black transition-all"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="font-black text-blue-800 text-sm">Validación de Negocio</p>
                  <p className="text-blue-600/70 text-xs font-bold mt-1">
                    Recuerda que si el parqueadero ya tiene una suscripción activa, la nueva suscripción reemplazará a la anterior tras su creación.
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 py-6 rounded-3xl text-white font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] transform hover:-translate-y-1"
              >
                {selectedSub ? 'Confirmar Cambios' : 'Activar Suscripción Ahora'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
