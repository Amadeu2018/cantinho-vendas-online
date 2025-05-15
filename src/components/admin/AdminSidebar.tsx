
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  SidebarRail,
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
  Menu,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AdminSidebar = ({ collapsed, setCollapsed }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth/login');
      toast({
        title: "Logout realizado",
        description: "Você saiu com sucesso da área administrativa",
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar fazer logout",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Sidebar 
      className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white border-r-0"
      data-collapsed={collapsed}
      data-state={collapsed ? "collapsed" : "expanded"}
    >
      <SidebarHeader className="border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6" />
            {!collapsed && <span className="text-xl font-bold">Cantinho Algarvio</span>}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-indigo-200 uppercase text-xs font-bold">Principal</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin")} tooltip="Dashboard">
                <Link to="/admin">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/orders")} tooltip="Pedidos">
                <Link to="/admin">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Pedidos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/eventos")} tooltip="Eventos">
                <Link to="/admin/eventos">
                  <CalendarDays className="h-5 w-5" />
                  <span>Eventos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/products")} tooltip="Cardápio">
                <Link to="/admin">
                  <Utensils className="h-5 w-5" />
                  <span>Cardápio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-indigo-200 uppercase text-xs font-bold">Financeiro</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/finance")} tooltip="Pagamentos">
                <Link to="/admin">
                  <Wallet className="h-5 w-5" />
                  <span>Pagamentos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/invoices")} tooltip="Faturas">
                <Link to="/admin">
                  <FileText className="h-5 w-5" />
                  <span>Faturas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/reports")} tooltip="Relatórios">
                <Link to="/admin">
                  <BarChart className="h-5 w-5" />
                  <span>Relatórios</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-indigo-200 uppercase text-xs font-bold">Configurações</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/customers")} tooltip="Clientes">
                <Link to="/admin">
                  <Users className="h-5 w-5" />
                  <span>Clientes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/settings")} tooltip="Configurações">
                <Link to="/admin">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={handleLogout} tooltip="Sair">
              <button className="w-full flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;
