import { NavLink,useNavigate } from 'react-router-dom';
import { LayoutDashboard,Receipt,ChevronRight,Wallet,Users,LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

export function Sidebar({ isOpen,setIsOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard,label: 'Dashboard',path: '/dashboard' },
    { icon: Receipt,label: 'Transactions',path: '/transactions' },
    { icon: Users,label: 'Collaborations',path: '/collaborations' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={clsx(
        "fixed lg:static inset-y-0 left-0 z-50 w-72 glass border-r border-white/20 transform transition-transform duration-300 ease-out lg:transform-none flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-glow">
              <Wallet size={20} />
            </div>
            Tracker
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-6">
          <p className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => clsx(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-glow"
                  : "text-text-muted hover:bg-white/50 hover:text-primary"
              )}
            >
              <item.icon size={20} className={clsx("transition-transform group-hover:scale-110")} />
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={16} className={clsx("opacity-0 -translate-x-2 transition-all",({ isActive }) => isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-50 group-hover:translate-x-0")} />
            </NavLink>
          ))}
        </nav>

        {/* Logout Button - Mobile Only */}
        <div className="p-4 border-t border-white/10 md:hidden">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-text-muted hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={20} className="transition-transform group-hover:scale-110" />
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}
