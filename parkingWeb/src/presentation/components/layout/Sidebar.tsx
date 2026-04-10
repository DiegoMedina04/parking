import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  ParkingCircle, 
  Ticket,
  LogOut,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../../../application/store/authStore';
import { ROLES } from '../../../domain/constants/roles';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (state: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (state: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={22} />,
      roles: [ROLES.ADMIN, ROLES.OPERATOR]
    },
    {
      label: 'Tickets',
      path: '/operacion',
      icon: <Ticket size={22} />,
      roles: [ROLES.OPERATOR]
    },
    {
      label: 'Clientes',
      path: '/clientes',
      icon: <UserCircle size={22} />,
      roles: [ROLES.OPERATOR]
    },
    {
      label: 'Usuarios',
      path: '/usuarios',
      icon: <Users size={22} />,
      roles: [ROLES.ADMIN]
    },
    {
      label: 'Planes',
      path: '/planes',
      icon: <Database size={22} />,
      roles: [ROLES.ADMIN]
    },
    {
      label: 'Suscripciones',
      path: '/suscripciones',
      icon: <CheckCircle2 size={22} />,
      roles: [ROLES.ADMIN]
    },
    {
      label: 'Parqueaderos',
      path: '/parqueaderos',
      icon: <ParkingCircle size={22} />,
      roles: [ROLES.ADMIN]
    },
    {
      label: 'Reportes',
      path: '/reportes',
      icon: <TrendingUp size={22} />,
      roles: [ROLES.ADMIN]
    }
  ].filter(item => user && item.roles.includes(user.role as any));

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-white/95 backdrop-blur-md border-r border-slate-200 z-40 transition-all duration-300 ease-in-out flex flex-col
      ${isCollapsed ? 'w-20' : 'w-72'}
      ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Botón de Colapso (Desktop) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3.5 top-10 w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section */}
      <div className={`p-6 mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-8'}`}>
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100 flex-shrink-0">
          <ParkingCircle size={24} />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-black text-slate-800 tracking-tighter whitespace-nowrap animate-in fade-in duration-500">
            PARKING<span className="text-blue-600">PRO</span>
          </span>
        )}
      </div>

      {/* Nav Content */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `
              flex items-center group relative h-12 rounded-xl font-bold transition-all duration-200
              ${isActive 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
              ${isCollapsed ? 'justify-center px-0' : 'px-5 gap-4'}
            `}
          >
            <div className={`flex-shrink-0 ${isCollapsed ? 'group-hover:scale-110 transition-transform' : ''}`}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className="text-[14px] whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
                {item.label}
              </span>
            )}
            
            {/* Tooltip for Collapsed State */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Perfil & Logout */}
      <div className={`mt-auto p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 transition-all ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                  <UserIcon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{user?.name}</p>
                  <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider mt-0.5">{user?.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl text-xs font-bold transition-all border border-slate-100 shadow-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-10 h-10 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-all border border-slate-100 shadow-sm"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
