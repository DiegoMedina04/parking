import { useState, useEffect } from 'react';
import { Plus, Database, Pencil, Trash2, X, AlertTriangle } from 'lucide-react';
import { planService } from '../../../infrastructure/services/planService';
import { PageHeader } from '../../components/layout/PageHeader';
import type { Plan } from '../../../domain/models/Plan';

export const PlansPage = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Plan>>({ name: '', maxPlaces: 0, monthlyValue: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await planService.getPlanes();
      setPlanes(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData({ name: plan.name, maxPlaces: plan.maxPlaces, monthlyValue: plan.monthlyValue });
    } else {
      setSelectedPlan(null);
      setFormData({ name: '', maxPlaces: 0, monthlyValue: 0 });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPlan) {
        await planService.updatePlan({ ...selectedPlan, ...formData } as Plan);
      } else {
        await planService.savePlan(formData as Plan);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Error al procesar la solicitud');
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan?.id) return;
    try {
      await planService.deletePlan(selectedPlan.id);
      setShowDeleteConfirm(false);
      setSelectedPlan(null);
      fetchData();
    } catch (error) {
      alert('Error al eliminar: Es posible que este plan tenga suscripciones asociadas.');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen font-sans animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        <PageHeader 
          title="Gestión de Capacidad" 
          subtitle="Define y administra los planes de cupos para las sedes de tu parqueadero."
          action={
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <Plus size={20} />
              Nuevo Plan
            </button>
          }
        />

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Plan</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Capacidad</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest">Mensualidad</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {planes.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 text-lg">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 text-slate-600 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider">
                      {p.maxPlaces} cupos totales
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-emerald-600 text-xl">
                    ${Number(p.monthlyValue).toLocaleString('es-CO')}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(p)}
                        className="p-2.5 bg-slate-100 hover:bg-blue-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:scale-90"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => { setSelectedPlan(p); setShowDeleteConfirm(true); }}
                        className="p-2.5 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-xl transition-all active:scale-90"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {planes.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <Database size={48} strokeWidth={1} />
                      <p className="font-medium italic text-lg">No se han configurado planes de capacidad aún.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {loading && (
             <div className="flex items-center justify-center p-20">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             </div>
          )}
        </div>
      </div>

      {/* Modal único para Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            <div className="p-10 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {selectedPlan ? 'Editar Plan' : 'Nuevo Plan'}
                </h2>
                <p className="text-slate-500 font-medium">Define los límites y el costo mensual de la sede.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-300 hover:text-slate-500 bg-slate-50 p-3 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest">Nombre Descriptivo</label>
                <input 
                  type="text" required
                  placeholder="Ej: Sede Norte - Estándar"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl px-6 py-4 outline-none text-slate-700 font-bold transition-all placeholder:text-slate-300"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest">Cupos Máximos</label>
                  <input 
                    type="number" required min="1"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl px-6 py-4 outline-none text-slate-700 font-bold transition-all"
                    value={formData.maxPlaces}
                    onChange={(e) => setFormData({...formData, maxPlaces: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest">Costo Mensual</label>
                  <input 
                    type="number" required min="0" step="100"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl px-6 py-4 outline-none text-slate-700 font-bold transition-all"
                    value={formData.monthlyValue}
                    onChange={(e) => setFormData({...formData, monthlyValue: Number(e.target.value)})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 py-5 rounded-2xl text-white font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                {selectedPlan ? 'Guardar Cambios' : 'Crear Plan Ahora'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in duration-300 border border-red-50">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">¿Estás seguro?</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Vas a eliminar el plan <span className="font-black text-slate-700">"{selectedPlan?.name}"</span>. Esta acción no se puede deshacer y fallará si hay clientes usando este plan.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-100 transition-all active:scale-95"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
