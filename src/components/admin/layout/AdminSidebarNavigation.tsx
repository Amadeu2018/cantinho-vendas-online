
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  ShoppingCart,
  Package,
  CalendarDays,
  Users,
  Archive,
  CreditCard,
  BarChart3,
  Settings,
  Utensils
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavigationItem {
  name: string;
  tab?: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminSidebarNavigationProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  onItemClick: () => void;
}

const AdminSidebarNavigation = ({ activeTab, onTabChange, onItemClick }: AdminSidebarNavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', tab: 'dashboard', icon: LayoutDashboard },
    { name: 'Pedidos', tab: 'orders', icon: ShoppingCart },
    { name: 'Produtos', tab: 'products', icon: Package },
    { name: 'Eventos', href: '/event-admin', icon: CalendarDays },
    { name: 'Clientes', tab: 'customers', icon: Users },
    { name: 'Estoque', tab: 'inventory', icon: Archive },
    { name: 'Finanças', tab: 'finance', icon: CreditCard },
    { name: 'Relatórios', tab: 'reports', icon: BarChart3 },
    { name: 'Cardápio', tab: 'menu', icon: Utensils },
    { name: 'Configurações', tab: 'settings', icon: Settings },
  ];

  const handleNavigation = (item: NavigationItem) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.tab && onTabChange) {
      onTabChange(item.tab);
    }
    onItemClick();
  };

  return (
    <nav className="mt-6 px-3">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isCurrentTab = item.tab === activeTab;
          const isEventPage = item.href === '/event-admin' && location.pathname === '/event-admin';
          const isCurrent = isCurrentTab || isEventPage;
          
          return (
            <Button
              key={item.name}
              onClick={() => handleNavigation(item)}
              variant="ghost"
              className={`w-full justify-start px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isCurrent
                  ? 'bg-cantinho-terracotta text-white shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
              {isCurrent && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminSidebarNavigation;
