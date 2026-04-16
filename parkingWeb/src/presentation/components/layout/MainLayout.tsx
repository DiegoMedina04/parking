import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, X, ParkingCircle, Building2 } from 'lucide-react';
import { useAppStore } from '../../../application/store/appStore';
import { useAuthStore } from '../../../application/store/authStore';
import { ROLES } from '../../../domain/constants/roles';

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeParkingName = useAppStore((state) => state.activeParkingName);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen bg-slate-50 transition-all duration-300">
      {/* Sidebar - Desktop y Mobile */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* TopBar - Solo visible en Móvil */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <ParkingCircle size={20} />
          </div>
          <span className="font-black text-slate-800 tracking-tighter">PARKINGPRO</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Área de Contenido Principal */}
      <main 
        className={`flex-1 transition-all duration-300 min-h-screen relative
          ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'} 
          pt-20 lg:pt-8 p-6 lg:p-10 flex flex-col`}
      >
        {/* Banner Global de Contexto */}
        {user?.role === ROLES.OPERATOR && activeParkingName && (
          <div className="max-w-7xl w-full mx-auto mb-6 bg-blue-600 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl shadow-blue-100 animate-in fade-in slide-in-from-top-4 duration-500 shrink-0 z-10 relative">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Building2 size={20} />
              </div>
              <p className="font-bold tracking-tight">Gestionando: <span className="font-black italic">{activeParkingName}</span></p>
            </div>
          </div>
        )}

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </main>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-30 animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
