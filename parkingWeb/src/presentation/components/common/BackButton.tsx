import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="group flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-blue-600 font-bold transition-all bg-white hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md active:scale-95"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      <span>Volver</span>
    </button>
  );
};
