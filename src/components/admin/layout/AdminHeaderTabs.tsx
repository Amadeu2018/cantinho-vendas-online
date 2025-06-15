
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  ShoppingCart,
  Package,
  CalendarDays,
  Users,
  Archive
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface AdminHeaderTabsProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

const AdminHeaderTabs = ({ activeTab, onTabChange }: AdminHeaderTabsProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', tab: 'dashboard', icon: LayoutDashboard },
    { name: 'Pedidos', tab: 'orders', icon: ShoppingCart },
    { name: 'Produtos', tab: 'products', icon: Package },
    { name: 'Eventos', href: '/event-admin', icon: CalendarDays },
    { name: 'Clientes', tab: 'customers', icon: Users },
    { name: 'Estoque', tab: 'inventory', icon: Archive },
  ];

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.tab && onTabChange) {
      onTabChange(item.tab);
    }
  };

  return (
    <div className="hidden xl:flex items-center gap-2 bg-gray-100 rounded-full p-1">
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
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isCurrent
                ? 'bg-cantinho-terracotta text-white shadow-md'
                : 'text-gray-600 hover:text-cantinho-navy hover:bg-white/50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden 2xl:inline">{item.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default AdminHeaderTabs;
