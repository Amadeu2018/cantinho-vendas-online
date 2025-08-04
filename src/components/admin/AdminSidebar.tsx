
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
    <Sidebar 
      className="bg-gradient-to-br from-cantinho-navy to-cantinho-navy/90 text-white border-r-0"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6 flex-shrink-0" />
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
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("orders")}
                onClick={() => handleTabClick("orders")}
                tooltip="Pedidos"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <ShoppingCart className="h-5 w-5 flex-shrink-0" />
                <span>Pedidos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("events")}
                onClick={() => handleTabClick("events")}
                tooltip="Eventos"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <CalendarDays className="h-5 w-5 flex-shrink-0" />
                <span>Eventos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("products")}
                onClick={() => handleTabClick("products")}
                tooltip="Produtos"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <Package className="h-5 w-5 flex-shrink-0" />
                <span>Produtos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("inventory")}
                onClick={() => handleTabClick("inventory")}
                tooltip="Estoque"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <Archive className="h-5 w-5 flex-shrink-0" />
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
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <Wallet className="h-5 w-5 flex-shrink-0" />
                <span>Finanças</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("payments")}
                onClick={() => handleTabClick("payments")}
                tooltip="Pagamentos"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <CreditCard className="h-5 w-5 flex-shrink-0" />
                <span>Pagamentos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("invoices")}
                onClick={() => handleTabClick("invoices")}
                tooltip="Faturas"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span>Faturas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("reports")}
                onClick={() => handleTabClick("reports")}
                tooltip="Relatórios"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <BarChart className="h-5 w-5 flex-shrink-0" />
                <span>Relatórios</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("analytics")}
                onClick={() => handleTabClick("analytics")}
                tooltip="Analytics"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <TrendingUp className="h-5 w-5 flex-shrink-0" />
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
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <Users className="h-5 w-5 flex-shrink-0" />
                <span>Clientes</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("menu")}
                onClick={() => handleTabClick("menu")}
                tooltip="Cardápio"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <Utensils className="h-5 w-5 flex-shrink-0" />
                <span>Cardápio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("promotions")}
                onClick={() => handleTabClick("promotions")}
                tooltip="Promoções"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <TrendingUp className="h-5 w-5 flex-shrink-0" />
                <span>Promoções</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("delivery-settings")}
                onClick={() => handleTabClick("delivery-settings")}
                tooltip="Taxa de Entrega"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <Wallet className="h-5 w-5 flex-shrink-0" />
                <span>Taxa de Entrega</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("image-manager")}
                onClick={() => handleTabClick("image-manager")}
                tooltip="Gestor de Imagens"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <Package className="h-5 w-5 flex-shrink-0" />
                <span>Gestor de Imagens</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("security-logs")}
                onClick={() => handleTabClick("security-logs")}
                tooltip="Logs de Segurança"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span>Logs de Segurança</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("settings")}
                onClick={() => handleTabClick("settings")}
                tooltip="Configurações"
                className="data-[active=true]:bg-white/20 data-[active=true]:text-white hover:bg-white/10 hover:text-white"
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-white/10 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={onLogout} 
              tooltip="Sair"
              className="hover:bg-red-500/20 hover:text-white"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
