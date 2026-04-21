import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Calendar, ChevronDown, Receipt, AlertCircle } from 'lucide-react';
import { monthlyService } from '../../../infrastructure/services/monthlyService';
import { useAppStore } from '../../../application/store/appStore';

interface PaymentRecord {
  id: string;
  fechaPago: string;
  valor: number;
  metodoPago: string;
  vehiculoPlaca: string;
  tarifaNombre: string;
}

interface SummaryData {
  totalRecaudado: number;
  totalTransacciones: number;
  pagos: PaymentRecord[];
}

const QUICK_RANGES = [
  { label: 'Hoy', getValue: () => { const d = new Date(); return { start: d.toISOString().split('T')[0], end: d.toISOString().split('T')[0] }; } },
  { label: 'Ayer', getValue: () => { const d = new Date(); d.setDate(d.getDate() - 1); const s = d.toISOString().split('T')[0]; return { start: s, end: s }; } },
  { label: 'Últimos 7 días', getValue: () => { const end = new Date(); const start = new Date(); start.setDate(start.getDate() - 6); return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] }; } },
  { label: 'Mes actual', getValue: () => { const now = new Date(); const start = new Date(now.getFullYear(), now.getMonth(), 1); return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] }; } },
];

export const MensualidadSummaryPanel: React.FC = () => {
  const { activeParkingId } = useAppStore();
  const [activeRange, setActiveRange] = useState('Hoy');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const fetchSummary = useCallback(async () => {
    if (!activeParkingId) return;
    setLoading(true);
    try {
      const data = await monthlyService.getPaymentSummary(activeParkingId, startDate, endDate);
      setSummary(data);
    } catch {
      setSummary({ totalRecaudado: 0, totalTransacciones: 0, pagos: [] });
    } finally {
      setLoading(false);
    }
  }, [activeParkingId, startDate, endDate]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const handleQuickRange = (range: typeof QUICK_RANGES[0]) => {
    const { start, end } = range.getValue();
    setActiveRange(range.label);
    setStartDate(start);
    setEndDate(end);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    setActiveRange('Personalizado');
    fetchSummary();
  };

  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Resumen de Recaudos</h2>
          <p className="text-slate-400 font-bold text-sm">Ingresos por mensualidades pagadas</p>
        </div>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-2 text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 font-black text-[10px] uppercase tracking-widest px-5 py-3 rounded-2xl transition-all"
        >
          <Calendar size={14} /> Personalizado <ChevronDown size={12} className={showCustom ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>
      </div>

      {/* Quick Range Selectors */}
      <div className="flex flex-wrap gap-3">
        {QUICK_RANGES.map(range => (
          <button
            key={range.label}
            onClick={() => handleQuickRange(range)}
            className={`px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeRange === range.label
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom Date Picker */}
      {showCustom && (
        <div className="flex flex-wrap items-end gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Desde</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-700 text-sm outline-none focus:border-slate-400 transition-all" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hasta</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 font-bold text-slate-700 text-sm outline-none focus:border-slate-400 transition-all" />
          </div>
          <button onClick={handleCustomApply}
            className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-black transition-all active:scale-95">
            Aplicar
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-600 to-emerald-500 text-white p-8 rounded-[2.5rem] shadow-xl shadow-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <p className="font-black text-[10px] uppercase tracking-widest text-green-100">Total Recaudado</p>
          </div>
          {loading ? (
            <div className="h-12 bg-white/20 rounded-2xl animate-pulse" />
          ) : (
            <h3 className="text-4xl font-black tracking-tighter">
              ${Number(summary?.totalRecaudado ?? 0).toLocaleString('es-CO')}
            </h3>
          )}
          <p className="text-green-100 text-sm font-bold mt-2">{activeRange}</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
              <Receipt size={20} />
            </div>
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Transacciones</p>
          </div>
          {loading ? (
            <div className="h-12 bg-slate-50 rounded-2xl animate-pulse" />
          ) : (
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">
              {summary?.totalTransacciones ?? 0}
            </h3>
          )}
          <p className="text-slate-400 text-sm font-bold mt-2">Pagos registrados</p>
        </div>
      </div>

      {/* Payments Table */}
      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Desglose de Pagos</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-50 rounded-2xl animate-pulse" />)}
          </div>
        ) : !summary?.pagos?.length ? (
          <div className="py-16 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <p className="text-slate-400 font-bold">No se encontraron pagos en el rango seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Placa</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarifa</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Método</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {summary.pagos.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">
                      {new Date(p.fechaPago).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-xl text-sm tracking-widest">
                        {p.vehiculoPlaca}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{p.tarifaNombre}</td>
                    <td className="px-8 py-5">
                      <span className="font-black text-[10px] uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
                        {p.metodoPago}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-800">
                      ${Number(p.valor).toLocaleString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/50 border-t-2 border-slate-100">
                  <td colSpan={4} className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-slate-500">Total del periodo</td>
                  <td className="px-8 py-5 text-right font-black text-green-600 text-lg">
                    ${Number(summary.totalRecaudado).toLocaleString('es-CO')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
