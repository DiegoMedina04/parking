import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown,
  User as UserIcon,
  CreditCard,
  Mail,
  Lock
} from 'lucide-react';
import type { User, UserDTO } from '../../../infrastructure/services/userService';
import type { Role } from '../../../infrastructure/services/roleService';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserDTO) => Promise<void>;
  selectedUser: User | null;
  roles: Role[];
}

export const UserFormModal = ({ isOpen, onClose, onSave, selectedUser, roles }: UserFormModalProps) => {
  const [formData, setFormData] = useState<UserDTO>({
    name: '',
    document: '',
    email: '',
    password: '',
    role: { id: '' }
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  // Custom Select State
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        document: selectedUser.document,
        email: selectedUser.email,
        password: '',
        role: { id: selectedUser.role.id }
      });
      setChangePassword(false);
    } else {
      setFormData({
        name: '',
        document: '',
        email: '',
        password: '',
        role: { id: '' }
      });
      setChangePassword(true);
    }
    setConfirmPassword('');
  }, [selectedUser, isOpen]);

  // Handle click outside for custom select
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPasswordValid = formData.password && formData.password.length >= 6;
  const passwordsMatch = formData.password === confirmPassword;
  
  const canSubmit = 
    formData.name && 
    formData.document && 
    formData.email && 
    formData.role.id &&
    (!changePassword || (isPasswordValid && passwordsMatch));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (selectedUser && !changePassword) {
      delete payload.password;
    }
    await onSave(payload);
  };

  if (!isOpen) return null;

  const selectedRoleName = roles.find(r => r.id === formData.role.id)?.name || 'Seleccionar Rol...';

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header Compacto */}
        <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {selectedUser ? 'Editar Perfil' : 'Nuevo Usuario'}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
              <Shield size={12} className="text-blue-500" />
              Accesos ParkingPro
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-50 text-slate-300 hover:text-slate-600 rounded-2xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Fila 1: Nombre y Cédula */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 rounded-2xl pl-12 pr-4 py-4 outline-none text-slate-700 font-bold text-sm transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Num. Cédula</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 rounded-2xl pl-12 pr-4 py-4 outline-none text-slate-700 font-bold text-sm transition-all"
                  value={formData.document}
                  onChange={(e) => setFormData({...formData, document: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email de Acceso</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="email" required
                className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 rounded-2xl pl-12 pr-4 py-4 outline-none text-slate-700 font-bold text-sm transition-all lowercase"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Selector de Rol Personalizado */}
          <div className="space-y-1.5" ref={selectRef}>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asignar Cargo/Rol</label>
            <div className="relative">
              <div 
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className={`
                  w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex justify-between items-center cursor-pointer transition-all
                  ${isSelectOpen ? 'ring-2 ring-blue-100 border-blue-200' : 'hover:bg-slate-100/50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Shield size={16} className={formData.role.id ? 'text-blue-500' : 'text-slate-300'} />
                  <span className={`text-sm font-bold ${formData.role.id ? 'text-slate-700' : 'text-slate-400'}`}>
                    {selectedRoleName}
                  </span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isSelectOpen && (
                <div className="absolute top-[110%] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {roles.map(r => (
                    <div 
                      key={r.id}
                      onClick={() => {
                        setFormData({...formData, role: { id: r.id }});
                        setIsSelectOpen(false);
                      }}
                      className="px-5 py-3 hover:bg-blue-50 hover:text-blue-600 text-sm font-bold text-slate-600 cursor-pointer flex items-center justify-between group"
                    >
                      {r.name}
                      {formData.role.id === r.id && <CheckCircle2 size={16} className="text-blue-500" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sección de Contraseña */}
          <div className="space-y-4 pt-2 border-t border-slate-50">
            {selectedUser && (
              <div className="flex items-center gap-2 px-1">
                <input 
                  type="checkbox" 
                  id="changePwdCheck"
                  className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={changePassword}
                  onChange={(e) => {
                    setChangePassword(e.target.checked);
                    if (!e.target.checked) {
                      setFormData({...formData, password: ''});
                      setConfirmPassword('');
                    }
                  }}
                />
                <label htmlFor="changePwdCheck" className="text-xs font-bold text-slate-600 cursor-pointer">Actualizar credenciales de acceso</label>
              </div>
            )}

            {changePassword && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type={showPassword ? "text" : "password"}
                        required={changePassword}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 rounded-2xl pl-12 pr-12 py-4 outline-none text-slate-700 font-bold text-sm transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        required={changePassword}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-blue-200 rounded-2xl pl-12 pr-12 py-4 outline-none text-slate-700 font-bold text-sm transition-all"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Feedback Real-time */}
                <div className="flex flex-col gap-1.5 px-2">
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${formData.password && formData.password.length >= 6 ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {formData.password && formData.password.length >= 6 ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    Mínimo 6 caracteres
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold ${formData.password && confirmPassword && passwordsMatch ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {formData.password && confirmPassword && passwordsMatch ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {formData.password && confirmPassword && !passwordsMatch ? 'Las contraseñas no coinciden' : 'Las contraseñas coinciden'}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!canSubmit}
            className={`
              w-full py-5 rounded-2xl text-white font-black text-lg shadow-xl transition-all active:scale-[0.98]
              ${canSubmit 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' 
                : 'bg-slate-200 cursor-not-allowed shadow-none'}
            `}
          >
            {selectedUser ? 'Guardar Cambios' : 'Confirmar Identidad'}
          </button>
        </form>
      </div>
    </div>
  );
};
