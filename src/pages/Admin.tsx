
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminFinance from "@/components/admin/AdminFinance";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminReports from "@/components/admin/AdminReports";
import AdminInvoice from "@/components/admin/AdminInvoice";
import AdminProducts from "@/components/admin/AdminProducts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrderDetail from "@/components/admin/AdminOrderDetail";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import NavEventButton from "@/components/admin/NavEventButton";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import { Order as CartOrder } from "@/contexts/CartContext";
import NotificationsDropdown from "@/components/admin/NotificationsDropdown";

// Converter o tipo Order de useAdminOrders para o tipo Order de CartContext
const convertOrderType = (order: any): CartOrder => {
  return {
    ...order,
    paymentMethod: {
      id: order.paymentMethod.id || 'default-id',
      name: order.paymentMethod.name,
      icon: order.paymentMethod.icon || 'credit-card'
    }
  };
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CartOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the custom hook for orders management
  const { 
    orders, 
    isLoading: fetchingOrders, 
    refreshOrders, 
    updateOrderStatus,
    updatePaymentStatus
  } = useAdminOrders();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.role === 'admin') {
          setIsAdmin(true);
          setIsLoading(false);
        } else {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissões de administrador.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error("Erro ao verificar perfil:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao verificar suas permissões.",
          variant: "destructive"
        });
      }
    };
    
    checkAdminStatus();
  }, [user, navigate, toast]);

  // Hook to create a notification when a new order is placed
  useEffect(() => {
    if (!isAdmin) return;

    const createOrderNotification = async (orderId: string) => {
      try {
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: user?.id,
            type: 'order',
            title: 'Novo Pedido',
            message: `Pedido ${orderId.slice(0, 8)} recebido`,
            read: false
          });
          
        if (error) throw error;
      } catch (error) {
        console.error("Erro ao criar notificação:", error);
      }
    };

    // Set up subscription for new orders
    const orderChannel = supabase
      .channel('new-orders')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'orders' }, 
        (payload) => {
          if (payload.new && payload.new.id) {
            createOrderNotification(payload.new.id);
          }
        }
      )
      .subscribe();

    // Set up subscription for order status changes
    const orderUpdateChannel = supabase
      .channel('order-updates')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'orders' }, 
        (payload) => {
          if (payload.new && payload.new.id && payload.old && 
              (payload.new.status !== payload.old.status || 
               payload.new.payment_status !== payload.old.payment_status)) {
            // Create notification for status change
            const statusChange = payload.new.status !== payload.old.status 
              ? `${payload.new.status}` 
              : `pagamento ${payload.new.payment_status}`;
            
            supabase
              .from('notifications')
              .insert({
                user_id: user?.id,
                type: 'order',
                title: 'Pedido Atualizado',
                message: `Pedido ${payload.new.id.slice(0, 8)} alterado para ${statusChange}`,
                read: false
              })
              .then(({ error }) => {
                if (error) console.error("Erro ao criar notificação de atualização:", error);
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(orderUpdateChannel);
    };
  }, [isAdmin, user]);

  const handleLogin = (isAdmin: boolean) => {
    setIsAuthenticated(isAdmin);
    if (isAdmin) {
      refreshOrders();
    }
    return isAdmin;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedOrderId(null);
    setActiveTab("orders");
    setSelectedInvoiceOrder(null);
  };
  
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };
  
  const handlePrepareInvoice = (order: any) => {
    setSelectedInvoiceOrder(convertOrderType(order));
    setActiveTab("invoice");
  };
  
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId) || null;
  };
  
  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="container mx-auto px-4 flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-cantinho-navy">Área Administrativa</h1>
          
          {!isAuthenticated ? (
            <AdminLogin onLogin={handleLogin} />
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 bg-cantinho-navy text-white flex justify-between items-center flex-wrap gap-3">
                <h2 className="text-xl font-semibold">Painel de Administração</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <NotificationsDropdown />
                  <NavEventButton />
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm"
                  >
                    Sair
                  </button>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                {selectedOrder ? (
                  <div>
                    <button 
                      onClick={() => setSelectedOrderId(null)}
                      className="mb-4 text-cantinho-terracotta hover:text-cantinho-terracotta/80 flex items-center"
                    >
                      &larr; Voltar para todos os pedidos
                    </button>
                    <AdminOrderDetail 
                      order={convertOrderType(selectedOrder)} 
                      onStatusChange={updateOrderStatus}
                      onPaymentStatusChange={updatePaymentStatus}
                      onPrepareInvoice={handlePrepareInvoice}
                    />
                  </div>
                ) : selectedInvoiceOrder && activeTab === "invoice" ? (
                  <div>
                    <button 
                      onClick={() => {
                        setSelectedInvoiceOrder(null);
                        setActiveTab("orders");
                      }}
                      className="mb-4 text-cantinho-terracotta hover:text-cantinho-terracotta/80 flex items-center"
                    >
                      &larr; Voltar para administração
                    </button>
                    <AdminInvoice order={selectedInvoiceOrder} />
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                      <TabsTrigger value="orders">Pedidos</TabsTrigger>
                      <TabsTrigger value="products">Produtos</TabsTrigger>
                      <TabsTrigger value="finance">Finanças</TabsTrigger>
                      <TabsTrigger value="inventory">Estoque</TabsTrigger>
                      <TabsTrigger value="reports">Relatórios</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="orders">
                      <AdminOrdersList 
                        orders={orders.map(order => convertOrderType(order) as any)} 
                        onSelectOrder={handleSelectOrder}
                        fetchingOrders={fetchingOrders}
                      />
                    </TabsContent>
                    
                    <TabsContent value="products">
                      <AdminProducts />
                    </TabsContent>
                    
                    <TabsContent value="finance">
                      <AdminFinance orders={orders.map(order => convertOrderType(order) as any)} />
                    </TabsContent>
                    
                    <TabsContent value="inventory">
                      <AdminInventory />
                    </TabsContent>
                    
                    <TabsContent value="reports">
                      <AdminReports orders={orders.map(order => convertOrderType(order) as any)} />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
