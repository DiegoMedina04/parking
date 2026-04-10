import { useState, useEffect } from 'react';
import { Plus, Shield, Pencil, Trash2, X, AlertCircle, Database } from 'lucide-react';
import { roleService, type Role } from '../../../infrastructure/services/roleService';
import { PageHeader } from '../../components/layout/PageHeader';

export const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Role>>({ name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setSelectedRole(role);
      setFormData({ name: role.name });
    } else {
      setSelectedRole(null);
      setFormData({ name: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        await roleService.updateRole(selectedRole.id, formData);
      } else {
        await roleService.saveRole(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Error al guardar el rol. Es posible que el nombre ya exista.');
    }
  };

  const handleDelete = async () => {
    if (!selectedRole?.id) return;
    try {
      await roleService.deleteRole(selectedRole.id);
      setShowDeleteConfirm(false);
      setSelectedRole(null);
      fetchData();
    } catch (error) {
      alert('Error al eliminar: Verifica que no haya usuarios asignados a este rol.');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen font-sans animate-in fade-in duration-700 pb-20">
      <div className="max-w-5xl mx-auto">
        
        <PageHeader 
          title="Gestión de Roles" 
          subtitle="Define los niveles de acceso y permisos para los usuarios del sistema."
          action={
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[2rem] font-black shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              <Plus size={24} />
              Crear Nuevo Rol
            </button>
          }
        />

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">ID/Orden</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Nombre del Rol</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {roles.map((r, index) => (
                <tr key={r.id} className="group hover:bg-blue-50/20 transition-all duration-300">
                  <td className="px-10 py-8">
                    <span className="font-black text-slate-300 group-hover:text-blue-200 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-blue-200 shadow-sm transition-all duration-500">
                        <Shield size={24} />
                      </div>
                      <span className="font-black text-slate-800 text-xl tracking-tight uppercase">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleOpenModal(r)}
                        className="p-3.5 bg-slate-50 text-slate-400 hover:bg-blue-100 hover:text-blue-600 rounded-2xl transition-all shadow-sm border border-slate-100"
                        title="Editar"
                      >
                        <Pencil size={20} />
                      </button>
                      <button 
                        onClick={() => { setSelectedRole(r); setShowDeleteConfirm(true); }}
                        className="p-3.5 bg-slate-50 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-slate-100"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <Database size={80} strokeWidth={1} />
                      <p className="font-black text-2xl tracking-tight italic text-slate-400">No se han definido roles aún.</p>
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

      {/* Modal - Crear/Editar Rol */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-6 z-50 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-12 pb-6 flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">
                  {selectedRole ? 'Ajustar Rol' : 'Nuevo Rol'}
                </h2>
                <p className="text-slate-500 font-bold mt-2">Los nombres de rol deben ser únicos y descriptivos.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-slate-50 p-4 rounded-3xl text-slate-300 hover:text-slate-600 transition-all hover:rotate-90"
              >
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-12 pt-6 space-y-10">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Identificador del Rol</label>
                <input 
                  type="text" required
                  placeholder="Ej: ADMIN, SUPERVISOR..."
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-3xl px-8 py-5 outline-none text-slate-800 font-black text-xl transition-all placeholder:text-slate-300 uppercase"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                />
              </div>

              <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="font-black text-blue-800 text-sm italic">Importante</p>
                  <p className="text-blue-600/70 text-xs font-bold mt-1">
                    Cambiar nombres de roles puede afectar los permisos de los usuarios vinculados. Procede con cautela.
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 py-6 rounded-3xl text-white font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] transform hover:-translate-y-1"
              >
                {selectedRole ? 'Confirmar Cambios' : 'Generar Rol Ahora'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-12 text-center animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">¿Eliminar Rol?</h3>
            <p className="text-slate-500 font-bold mb-10 leading-relaxed text-lg">
              Vas a extinguir el rol <span className="text-slate-800 underline decoration-red-200 decoration-4">"{selectedRole?.name}"</span>. 
              Esta operación es irreversible.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all"
              >
                Abordar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-5 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
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
