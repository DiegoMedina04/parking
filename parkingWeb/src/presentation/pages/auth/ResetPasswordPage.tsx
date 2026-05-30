import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../infrastructure/services/authService';
import { Lock, Loader2, Sparkles, AlertTriangle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Falta el token de recuperación en la dirección URL.');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden. Inténtalo de nuevo.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSubmitted(true);
      toast.success('¡Contraseña restablecida exitosamente!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans overflow-hidden bg-white">
      {/* Lado Izquierdo: Branding & Visuals */}
      <div className="hidden lg:flex relative bg-slate-900 overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1e293b_0%,#0f172a_100%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30 transform -skew-y-12 scale-150">
          <div className="grid grid-cols-6 gap-4 animate-pulse">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="h-64 bg-blue-500/10 rounded-3xl" />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <div className="inline-flex items-center gap-3 bg-blue-500/20 px-6 py-2.5 rounded-full border border-blue-500/30 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="text-blue-400" size={18} />
            <span className="text-blue-200 text-xs font-black uppercase tracking-[0.2em]">ParkingPro v4.0</span>
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            Asegura tu<br />
            <span className="text-blue-500">Cuenta</span><br />
            con Seguridad.
          </h1>
          <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
            Ingresa tu nueva contraseña para volver a tomar el control absoluto de tus sedes.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario de Restablecimiento */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-slate-50/30">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200">
               <Lock className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-3 italic">Nueva Contraseña</h2>
            <p className="text-slate-400 font-bold text-lg">Define una contraseña fuerte y segura para tu cuenta.</p>
          </div>

          {!token ? (
            <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8 text-center space-y-4 animate-in shake duration-500">
              <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                 <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Enlace Inválido</h3>
              <p className="text-slate-500 font-bold leading-relaxed">
                Este enlace de restablecimiento de contraseña no contiene un token válido. Por favor, solicita uno nuevo desde la pantalla de olvido de contraseña.
              </p>
              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-[1.5rem] transition-colors cursor-pointer"
              >
                Solicitar nuevo enlace
              </button>
            </div>
          ) : !submitted ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-100 rounded-[2rem] pl-16 pr-16 py-5 outline-none font-bold text-slate-700 shadow-sm focus:shadow-md focus:border-blue-100 transition-all placeholder:text-slate-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-100 rounded-[2rem] pl-16 pr-16 py-5 outline-none font-bold text-slate-700 shadow-sm focus:shadow-md focus:border-blue-100 transition-all placeholder:text-slate-300"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] text-xl shadow-2xl shadow-blue-100 transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Restablecer Contraseña
                    <Sparkles size={24} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] p-8 text-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                 <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">¡Contraseña Cambiada!</h3>
              <p className="text-slate-500 font-bold leading-relaxed">
                Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión en unos segundos para ingresar con tus nuevas credenciales.
              </p>
              <div className="w-8 h-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="flex items-center justify-between text-slate-300 pt-8 border-t border-slate-100 italic">
            <span className="text-xs font-black uppercase tracking-widest">© 2026 ParkingPro</span>
            <div className="flex gap-4">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Sistema Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
