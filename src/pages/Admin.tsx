
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAuthentication from "@/components/admin/AdminAuthentication";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOrderView from "@/components/admin/AdminOrderView";
import AdminInvoiceView from "@/components/admin/AdminInvoiceView";
import { Order as CartOrder } from "@/contexts/CartContext";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { useToast } from "@/hooks/use-toast";

const convertOrderType = (order: any): CartOrder => {
  return {
    ...order,
    paymentMethod: {
      id: order.paymentMethod?.id || 'default-id',
      name: order.paymentMethod?.name || 'Método de pagamento',
      icon: order.paymentMethod?.icon || 'credit-card'
    }
  };
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CartOrder | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  const { 
    orders, 
    isLoading: fetchingOrders, 
    refreshOrders, 
    updateOrderStatus,
    updatePaymentStatus
  } = useAdminOrders();
  
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Check if there's a state for activeTab from navigation
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        refreshOrders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshOrders]);

  const handleAuthentication = (isAdmin: boolean) => {
    setIsAuthenticated(isAdmin);
    if (isAdmin) {
      refreshOrders();
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedOrderId(null);
    setSelectedInvoiceOrder(null);
  };
  
  const handleSelectOrder = (orderId: string | null) => {
    setSelectedOrderId(orderId);
  };
  
  const handlePrepareInvoice = (order: CartOrder) => {
    setSelectedInvoiceOrder(order);
    setSelectedOrderId(null);
  };
  
  const handleBackFromInvoice = () => {
    setSelectedInvoiceOrder(null);
  };
  
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId) || null;
  };
  
  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null;
  const convertedOrders = orders.map(order => convertOrderType(order));

  const handleOrderStatusChange = async (orderId: string, status: string): Promise<void> => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pedido",
        variant: "destructive"
      });
    }
  };
  
  const handlePaymentStatusChange = async (orderId: string, status: string): Promise<void> => {
    try {
      await updatePaymentStatus(orderId, status);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pagamento",
        variant: "destructive"
      });
    }
  };

  const getTitle = () => {
    if (selectedOrder) {
      return `Pedido #${selectedOrder.id.slice(0, 8)}`;
    }
    if (selectedInvoiceOrder) {
      return "Fatura";
    }
    
    // Map activeTab to title
    const titleMap: { [key: string]: string } = {
      dashboard: "Dashboard",
      pedidos: "Pedidos",
      produtos: "Produtos",
      clientes: "Clientes",
      finanças: "Finanças",
      relatórios: "Relatórios",
      configurações: "Configurações"
    };
    
    return titleMap[activeTab] || "Dashboard";
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <AdminAuthentication onAuthenticated={handleAuthentication} />;
    }

    if (selectedOrder) {
      return (
        <AdminOrderView 
          order={convertOrderType(selectedOrder)}
          onSelectOrder={handleSelectOrder}
          onStatusChange={handleOrderStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          onPrepareInvoice={handlePrepareInvoice}
        />
      );
    }

    if (selectedInvoiceOrder) {
      return (
        <AdminInvoiceView 
          order={selectedInvoiceOrder} 
          onBack={handleBackFromInvoice}
        />
      );
    }

    return (
      <AdminDashboard 
        orders={convertedOrders}
        fetchingOrders={fetchingOrders}
        onSelectOrder={orderId => handleSelectOrder(orderId)}
        onPrepareInvoice={handlePrepareInvoice}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    );
  };

  if (!isAuthenticated) {
    return renderContent();
  }

  return (
    <AdminLayout onLogout={handleLogout} title={getTitle()}>
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
