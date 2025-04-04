
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminOrders from "@/components/admin/AdminOrders";
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

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  const fetchOrders = async () => {
    try {
      setFetchingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedOrders = data.map(order => {
        let customerInfo = { name: 'Cliente' };
        let paymentMethodName = 'Desconhecido';
        
        try {
          if (typeof order.customer_info === 'string') {
            customerInfo = JSON.parse(order.customer_info);
          } else if (order.customer_info) {
            customerInfo = order.customer_info;
          }
          
          // Handle different payment_method formats
          if (typeof order.payment_method === 'string') {
            paymentMethodName = order.payment_method;
          } else if (typeof order.payment_method === 'number') {
            paymentMethodName = String(order.payment_method);
          } else if (order.payment_method === true) {
            paymentMethodName = 'Confirmado';
          } else if (order.payment_method === false) {
            paymentMethodName = 'Não Confirmado';
          } else if (order.payment_method === null || order.payment_method === undefined) {
            paymentMethodName = 'Desconhecido';
          } else if (order.payment_method && typeof order.payment_method === 'object') {
            const pm = order.payment_method as Record<string, any>;
            if (pm.name && typeof pm.name === 'string') {
              paymentMethodName = pm.name;
            } else {
              paymentMethodName = 'Objeto';
            }
          } else {
            paymentMethodName = 'Desconhecido';
          }
        } catch (e) {
          console.error("Error parsing order data:", e);
        }
        
        return {
          ...order,
          id: order.id,
          customerInfo,
          paymentMethod: { name: paymentMethodName },
          total: order.total,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          status: order.status || 'pending',
          paymentStatus: order.payment_status || 'pending',
          items: typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || [])
        };
      });
      
      setOrders(formattedOrders);
      
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar a lista de pedidos.",
        variant: "destructive"
      });
    } finally {
      setFetchingOrders(false);
    }
  };
  
  const handleLogin = (isAdmin: boolean) => {
    setIsAuthenticated(isAdmin);
    if (isAdmin) {
      fetchOrders();
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
  
  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      toast({
        title: "Status atualizado",
        description: `O status do pedido foi atualizado para ${status}.`
      });
      
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status do pedido.",
        variant: "destructive"
      });
    }
  };
  
  const handlePaymentStatusChange = async (orderId: string, status: "pending" | "completed") => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, paymentStatus: status } : order
      ));
      
      toast({
        title: "Status de pagamento atualizado",
        description: `O status de pagamento foi atualizado para ${status === 'completed' ? 'pago' : 'pendente'}.`
      });
      
    } catch (error) {
      console.error("Erro ao atualizar status de pagamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status de pagamento.",
        variant: "destructive"
      });
    }
  };
  
  const handlePrepareInvoice = (order: any) => {
    setSelectedInvoiceOrder(order);
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
              <div className="p-4 bg-cantinho-navy text-white flex justify-between items-center">
                <h2 className="text-xl font-semibold">Painel de Administração</h2>
                <div className="flex items-center gap-2">
                  <NavEventButton />
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm"
                  >
                    Sair
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {selectedOrder ? (
                  <div>
                    <button 
                      onClick={() => setSelectedOrderId(null)}
                      className="mb-4 text-cantinho-terracotta hover:text-cantinho-terracotta/80 flex items-center"
                    >
                      &larr; Voltar para todos os pedidos
                    </button>
                    <AdminOrderDetail 
                      order={selectedOrder} 
                      onStatusChange={handleStatusChange}
                      onPaymentStatusChange={handlePaymentStatusChange}
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
                    <TabsList className="w-full mb-6 grid grid-cols-5 md:flex md:flex-wrap">
                      <TabsTrigger value="orders">Pedidos</TabsTrigger>
                      <TabsTrigger value="products">Produtos</TabsTrigger>
                      <TabsTrigger value="finance">Finanças</TabsTrigger>
                      <TabsTrigger value="inventory">Estoque</TabsTrigger>
                      <TabsTrigger value="reports">Relatórios</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="orders">
                      {fetchingOrders ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mr-2" />
                          <p>Carregando pedidos...</p>
                        </div>
                      ) : (
                        <Tabs defaultValue="pending">
                          <TabsList className="w-full overflow-x-auto flex">
                            <TabsTrigger value="pending">Pendentes</TabsTrigger>
                            <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
                            <TabsTrigger value="preparing">Em Preparo</TabsTrigger>
                            <TabsTrigger value="delivering">Em Entrega</TabsTrigger>
                            <TabsTrigger value="completed">Concluídos</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                            <TabsTrigger value="all">Todos</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="pending">
                            <AdminOrders 
                              orders={orders.filter(order => order.status === "pending")} 
                              onSelectOrder={handleSelectOrder}
                            />
                          </TabsContent>
                          
                          <TabsContent value="confirmed">
                            <AdminOrders 
                              orders={orders.filter(order => order.status === "confirmed")} 
                              onSelectOrder={handleSelectOrder}
                            />
                          </TabsContent>
                          
                          <TabsContent value="preparing">
                            <AdminOrders 
                              orders={orders.filter(order => order.status === "preparing")} 
                              onSelectOrder={handleSelectOrder}
                            />
                          </TabsContent>
                          
                          <TabsContent value="delivering">
                            <AdminOrders 
                              orders={orders.filter(order => order.status === "delivering")} 
                              onSelectOrder={handleSelectOrder}
                            />
                          </TabsContent>
                          
                          <TabsContent value="completed">
                            <AdminOrders 
                              orders={orders.filter(order => order.status === "completed")} 
                              onSelectOrder={handleSelectOrder}
                            />
                          </TabsContent>
                          
                          <TabsContent value="cancelled">
                            <AdminOrders 
                              orders={orders.filter(order => order.status === "cancelled")} 
                              onSelectOrder={handleSelectOrder}
                            />
                          </TabsContent>
                          
                          <TabsContent value="all">
                            <AdminOrders 
                              orders={orders} 
                              onSelectOrder={handleSelectOrder}
                            />
                          </TabsContent>
                        </Tabs>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="products">
                      <AdminProducts />
                    </TabsContent>
                    
                    <TabsContent value="finance">
                      <AdminFinance orders={orders} />
                    </TabsContent>
                    
                    <TabsContent value="inventory">
                      <AdminInventory />
                    </TabsContent>
                    
                    <TabsContent value="reports">
                      <AdminReports orders={orders} />
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
