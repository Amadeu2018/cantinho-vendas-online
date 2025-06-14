
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LogOut, 
  Settings, 
  Search,
  Menu,
  X,
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Users,
  BarChart3,
  CreditCard,
  CalendarDays,
  Home
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationsDropdown from "./NotificationsDropdown";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  title?: string;
}

const AdminLayout = ({ children, onLogout, title = "Dashboard" }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: location.pathname === '/admin' },
    { name: 'Pedidos', href: '/admin', icon: ShoppingCart, current: location.pathname === '/admin' && title === 'Pedidos' },
    { name: 'Produtos', href: '/admin', icon: Package, current: location.pathname === '/admin' && title === 'Produtos' },
    { name: 'Eventos', href: '/event-admin', icon: CalendarDays, current: location.pathname === '/event-admin' },
    { name: 'Clientes', href: '/admin', icon: Users, current: location.pathname === '/admin' && title === 'Clientes' },
    { name: 'Relatórios', href: '/admin', icon: BarChart3, current: location.pathname === '/admin' && title === 'Relatórios' },
    { name: 'Finanças', href: '/admin', icon: CreditCard, current: location.pathname === '/admin' && title === 'Finanças' },
    { name: 'Configurações', href: '/admin', icon: Settings, current: location.pathname === '/admin' && title === 'Configurações' },
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.href === '/admin' && item.name !== 'Dashboard') {
      // For admin sections, stay on /admin but change the tab
      navigate('/admin', { state: { activeTab: item.name.toLowerCase() } });
    } else {
      navigate(item.href);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-cantinho-navy to-cantinho-navy/90 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-cantinho-navy/20 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Cantinho Admin</h1>
              <p className="text-xs text-white/70">Painel de Controle</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    item.current
                      ? 'bg-cantinho-terracotta text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {item.current && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats in Sidebar */}
        <div className="absolute bottom-4 left-3 right-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h3 className="text-white font-semibold text-sm mb-3">Status Rápido</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/80">
                <span>Pedidos Hoje</span>
                <span className="font-semibold text-cantinho-sand">23</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Online</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-400">Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2 text-cantinho-navy hover:text-cantinho-terracotta transition-colors">
                  <Home className="h-4 w-4" />
                  <span className="text-sm">Voltar ao Site</span>
                </Link>
                <div className="w-px h-6 bg-gray-300"></div>
                <h1 className="font-bold text-xl text-cantinho-navy">{title}</h1>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar pedidos, clientes..."
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>

              {/* Notifications */}
              <NotificationsDropdown />

              {/* Settings */}
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-cantinho-terracotta text-white text-xs">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Administrador</p>
                  <p className="text-xs text-gray-500">admin@cantinho.ao</p>
                </div>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
