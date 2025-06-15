
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CalendarDays, 
  Utensils, 
  Wallet, 
  FileText, 
  BarChart, 
  Users, 
  Settings, 
  LogOut,
  Package,
  TrendingUp,
  CreditCard,
  Archive,
  Home
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar = ({ activeTab, onTabChange, onLogout }: AdminSidebarProps) => {
  const location = useLocation();
  
  const isActive = (tab: string) => {
    return activeTab === tab;
  };

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
  };
  
  return (
    <Sidebar className="bg-gradient-to-br from-cantinho-navy to-cantinho-navy/90 text-white border-r-0">
      <SidebarHeader className="border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6" />
            <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">Cantinho Algarvio</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 group-data-[collapsible=icon]:sr-only">Principal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("dashboard")}
                onClick={() => handleTabClick("dashboard")}
                tooltip="Dashboard"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("orders")}
                onClick={() => handleTabClick("orders")}
                tooltip="Pedidos"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Pedidos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("events")}
                onClick={() => handleTabClick("events")}
                tooltip="Eventos"
              >
                <CalendarDays className="h-5 w-5" />
                <span>Eventos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("products")}
                onClick={() => handleTabClick("products")}
                tooltip="Produtos"
              >
                <Package className="h-5 w-5" />
                <span>Produtos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("inventory")}
                onClick={() => handleTabClick("inventory")}
                tooltip="Estoque"
              >
                <Archive className="h-5 w-5" />
                <span>Estoque</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 group-data-[collapsible=icon]:sr-only">Financeiro</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("finance")}
                onClick={() => handleTabClick("finance")}
                tooltip="Finanças"
              >
                <Wallet className="h-5 w-5" />
                <span>Finanças</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("payments")}
                onClick={() => handleTabClick("payments")}
                tooltip="Pagamentos"
              >
                <CreditCard className="h-5 w-5" />
                <span>Pagamentos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("invoices")}
                onClick={() => handleTabClick("invoices")}
                tooltip="Faturas"
              >
                <FileText className="h-5 w-5" />
                <span>Faturas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("reports")}
                onClick={() => handleTabClick("reports")}
                tooltip="Relatórios"
              >
                <BarChart className="h-5 w-5" />
                <span>Relatórios</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("analytics")}
                onClick={() => handleTabClick("analytics")}
                tooltip="Analytics"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 group-data-[collapsible=icon]:sr-only">Gestão</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("customers")}
                onClick={() => handleTabClick("customers")}
                tooltip="Clientes"
              >
                <Users className="h-5 w-5" />
                <span>Clientes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("menu")}
                onClick={() => handleTabClick("menu")}
                tooltip="Cardápio"
              >
                <Utensils className="h-5 w-5" />
                <span>Cardápio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("settings")}
                onClick={() => handleTabClick("settings")}
                tooltip="Configurações"
              >
                <Settings className="h-5 w-5" />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-white/10 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout} tooltip="Sair">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
