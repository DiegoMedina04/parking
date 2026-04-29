import { Car } from 'lucide-react';

interface CapacityMeterProps {
  current: number;
  max: number;
}

export const CapacityMeter = ({ current, max }: CapacityMeterProps) => {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  
  let colorClass = 'bg-emerald-500';
  let textColorClass = 'text-emerald-600';
  let bgLightClass = 'bg-emerald-50';

  if (percentage >= 100) {
    colorClass = 'bg-rose-500';
    textColorClass = 'text-rose-600';
    bgLightClass = 'bg-rose-50';
  } else if (percentage >= 80) {
    colorClass = 'bg-amber-500';
    textColorClass = 'text-amber-600';
    bgLightClass = 'bg-amber-50';
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${bgLightClass} ${textColorClass} rounded-[1.5rem] flex items-center justify-center transition-colors`}>
            <Car size={28} />
          </div>
          <div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-1">Capacidad del Plan</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
              {current} <span className="text-lg font-bold text-slate-300">/ {max}</span>
            </h3>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-2xl text-sm font-black ${bgLightClass} ${textColorClass}`}>
          {percentage.toFixed(0)}%
        </div>
      </div>
      
      <div className="relative z-10 space-y-3">
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-1">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass} shadow-sm`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm font-bold text-slate-400">
            {percentage >= 100 
              ? '🚫 Capacidad Completa' 
              : percentage >= 80 
                ? '⚠️ Quedan pocos lugares' 
                : '✅ Espacio disponible'}
          </p>
          <p className="text-xs font-black text-slate-300 uppercase tracking-tighter">
            {max - current} Lugares libres
          </p>
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className={`absolute -right-4 -bottom-4 ${textColorClass} opacity-[0.03] group-hover:scale-110 transition-transform`}>
        <Car size={160} />
      </div>
    </div>
  );
};
