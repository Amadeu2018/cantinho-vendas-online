
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAuthentication from "@/components/admin/AdminAuthentication";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOrderView from "@/components/admin/AdminOrderView";
import AdminInvoiceView from "@/components/admin/AdminInvoiceView";
import { Order as CartOrder } from "@/contexts/CartContext";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Converter o tipo Order de useAdminOrders para o tipo Order de CartContext
const convertOrderType = (order: any): CartOrder => {
  return {
    ...order,
    paymentMethod: {
      id: order.paymentMethod?.id || 'default-id',
      name: order.paymentMethod?.name || 'Método de pagamento',
      icon: order.paymentMethod?.icon || 'credit-card'
    },
    type: order.type || "Pedido" // Add missing type property
  };
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CartOrder | null>(null);
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
    const checkAuth = async () => {
      if (!user) {
        // If no user is logged in, redirect to login page
        setIsLoading(false);
        setIsAuthenticated(false);
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar a área administrativa.",
          variant: "destructive"
        });
        navigate('/auth/login');
        return;
      }
      
      try {
        // Check if user is admin
        const isAdmin = user.role === 'admin';
        setIsAuthenticated(isAdmin);
        
        if (!isAdmin) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissões de administrador.",
            variant: "destructive"
          });
          navigate('/');
        } else {
          refreshOrders();
        }
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [user, navigate, toast, refreshOrders]);

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

  // Wrapper functions that discard the boolean return value from the original functions
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

  // Define the title based on the current view
  const getTitle = () => {
    if (selectedOrder) {
      return `Pedido #${selectedOrder.id.slice(0, 8)}`;
    }
    if (selectedInvoiceOrder) {
      return "Fatura";
    }
    return "Dashboard";
  };

  // Render different content based on application state
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
      />
    );
  };

  return (
    <AdminLayout isLoading={isLoading} title={getTitle()}>
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
