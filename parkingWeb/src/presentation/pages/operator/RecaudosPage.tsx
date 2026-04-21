import { MensualidadSummaryPanel } from '../../components/operator/MensualidadSummaryPanel';
import { PageHeader } from '../../components/layout/PageHeader';

export const RecaudosPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <PageHeader
          title="Reporte de Pagos"
          subtitle="Resumen de ingresos por mensualidades"
        />
        <MensualidadSummaryPanel />
      </div>
    </div>
  );
};
