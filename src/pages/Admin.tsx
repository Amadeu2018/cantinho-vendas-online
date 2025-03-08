
import { useState } from "react";
import { useCart, Order, OrderStatus } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminLogin from "@/components/admin/AdminLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrderDetail from "@/components/admin/AdminOrderDetail";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { orders, getOrderById, updateOrderStatus, updateOrderPaymentStatus } = useCart();
  
  // Admin credentials (in a real application, this would be handled securely on a backend)
  const handleLogin = (username: string, password: string) => {
    // Simple check - in a real application this should be a secure authentication process
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedOrderId(null);
  };
  
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };
  
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };
  
  const handlePaymentStatusChange = (orderId: string, status: "pending" | "completed") => {
    updateOrderPaymentStatus(orderId, status);
  };
  
  // Get the selected order details
  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null;

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
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm"
                >
                  Sair
                </button>
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
                    />
                  </div>
                ) : (
                  <Tabs defaultValue="pending">
                    <TabsList>
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
