import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../infrastructure/services/authService';
import { Mail, Loader2, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success('¡Instrucciones enviadas! Revisa tu bandeja de entrada.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al solicitar el restablecimiento.');
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
            Recupera tu<br />
            <span className="text-blue-500">Acceso</span><br />
            en un Instante.
          </h1>
          <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
            No te preocupes. Te ayudaremos a reestablecer tu contraseña de forma segura y veloz.
          </p>
          <div className="flex justify-center gap-12 text-white">
            <div className="text-center">
              <p className="text-4xl font-black mb-1">100%</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Seguro</p>
            </div>
            <div className="h-12 w-px bg-slate-800" />
            <div className="text-center">
              <p className="text-4xl font-black mb-1">1 click</p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Recuperación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Formulario de Solicitud */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-slate-50/30">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-200">
               <Mail className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-3 italic">¿Olvidaste tu contraseña?</h2>
            <p className="text-slate-400 font-bold text-lg">Ingresa tu correo y te enviaremos las instrucciones de recuperación.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input
                    type="email"
                    placeholder="ejemplo@parking.com"
                    className="w-full bg-white border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none font-bold text-slate-700 shadow-sm focus:shadow-md focus:border-blue-100 transition-all placeholder:text-slate-300"
                    value={email}
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                    Enviar Instrucciones
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
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">¡Correo Enviado!</h3>
              <p className="text-slate-500 font-bold leading-relaxed">
                Hemos enviado un correo a <strong className="text-slate-700">{email}</strong> con un enlace único para cambiar tu contraseña. Por favor, revisa tu bandeja de entrada y spam.
              </p>
            </div>
          )}

          <div className="pt-4 text-center">
             <button 
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 group cursor-pointer text-slate-500 font-bold hover:text-blue-600 transition-colors"
              >
               <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
               Volver al inicio de sesión
             </button>
          </div>

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
