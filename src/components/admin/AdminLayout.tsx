
import React, { useState, useEffect } from "react";
import { Loader2, Menu, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  title?: string;
}

const AdminLayout = ({ children, isLoading = false, title = "Área Administrativa" }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta área.",
        variant: "destructive",
      });
      navigate('/auth/login');
    }
  }, [user, isLoading, navigate, toast]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin mr-2 text-[#4f46e5]" />
          <p className="text-[#4f46e5]">Carregando...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, don't render the layout
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full">
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden mr-4"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="border-b bg-gray-50">Notificações</DropdownMenuLabel>
                  <DropdownMenuItem className="py-3 cursor-pointer">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Menu className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-sm">Novo pedido recebido</p>
                        <p className="text-xs text-gray-500">5 min atrás</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-3 cursor-pointer">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Menu className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-sm">Pagamento confirmado</p>
                        <p className="text-xs text-gray-500">1 hora atrás</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-xs font-medium text-center text-[#4f46e5]">
                    Ver todas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden md:inline-block">{user.email || "Admin"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="border-b bg-gray-50">
                    <div className="text-xs font-medium text-gray-500">Logado como</div>
                    <div className="text-sm font-medium text-gray-800">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
