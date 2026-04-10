import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  User as UserIcon, 
  Mail, 
  CreditCard, 
  Shield, 
  Pencil, 
  Trash2, 
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { userService, type User, type UserDTO } from '../../../infrastructure/services/userService';
import { roleService, type Role } from '../../../infrastructure/services/roleService';
import { PageHeader } from '../../components/layout/PageHeader';
import { UserFormModal } from '../../components/admin/UserFormModal';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        userService.getUsers(),
        roleService.getRoles()
      ]);
      setUsers(usersRes);
      setRoles(rolesRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    setSelectedUser(user || null);
    setShowModal(true);
  };

  const handleSave = async (payload: UserDTO) => {
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, payload);
      } else {
        await userService.saveUser(payload);
      }
      setShowModal(false);
      fetchInitialData();
    } catch (error) {
      alert('Error al procesar la solicitud. Verifica el correo o la cédula.');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser?.id) return;
    try {
      await userService.deleteUser(selectedUser.id);
      setShowDeleteConfirm(false);
      fetchInitialData();
    } catch (error) {
      alert('No se puede eliminar el usuario.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.document.includes(searchTerm)
  );

  return (
    <div className="min-h-screen font-sans animate-in fade-in duration-700 pb-20">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="Gestión de Usuarios" 
          subtitle="Registra operadores y administradores para el control de tus sedes."
          action={
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[2rem] font-black shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              <Plus size={24} />
              Crear Nuevo Usuario
            </button>
          }
        />

        {/* Buscador y Filtros */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nombre o cédula..."
            className="w-full bg-white border border-slate-100 rounded-[2.5rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 shadow-sm focus:shadow-md transition-all placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Perfil de Usuario</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Identificación</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Email / Contacto</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Rol Asignado</th>
                <th className="px-10 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-blue-50/20 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500">
                        <UserIcon size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-lg leading-none">{u.name}</p>
                        <p className="text-slate-400 text-xs mt-1.5 font-bold uppercase tracking-wider">ID: {u.id.split('-')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 font-bold text-slate-600">
                      <CreditCard size={16} className="text-slate-300" />
                      <span>{u.document}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 font-bold text-slate-500 italic">
                      <Mail size={16} className="text-blue-400" />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`
                      inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border
                      ${u.role.name === 'ADMIN' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'}
                    `}>
                      <Shield size={12} />
                      {u.role.name}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button 
                         onClick={() => handleOpenModal(u)}
                         className="p-3 bg-white text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all shadow-sm border border-slate-100"
                         title="Editar Perfil"
                      >
                        <Pencil size={22} />
                      </button>
                      <button 
                        onClick={() => { setSelectedUser(u); setShowDeleteConfirm(true); }}
                        className="p-3 bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-slate-100"
                        title="Inhabilitar"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !loading && (
                <tr>
                   <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-6 opacity-20">
                        <UserCheck size={80} strokeWidth={1} />
                        <p className="font-black text-2xl tracking-tight italic">No se encontraron usuarios</p>
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

      {/* Modal - CRUD Usuarios */}
      <UserFormModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        selectedUser={selectedUser}
        roles={roles}
      />

      {/* Modal Confirmación Borrado */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full max-md rounded-[3rem] shadow-2xl p-12 text-center animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">¿Inhabilitar Usuario?</h3>
            <p className="text-slate-500 font-bold mb-10 leading-relaxed text-lg">
              Vas a retirar el acceso a <span className="text-slate-800 underline decoration-red-200 decoration-4">"{selectedUser?.name}"</span>. 
              Sus registros históricos permanecerán, pero no podrá loguearse.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-5 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
