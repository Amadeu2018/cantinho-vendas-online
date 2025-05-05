
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAuthentication from "@/components/admin/AdminAuthentication";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOrderView from "@/components/admin/AdminOrderView";
import AdminInvoiceView from "@/components/admin/AdminInvoiceView";
import { Order as CartOrder } from "@/contexts/CartContext";
import { useAdminOrders } from "@/hooks/use-admin-orders";

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CartOrder | null>(null);
  const { user } = useAuth();
  
  // Use the custom hook for orders management
  const { 
    orders, 
    isLoading: fetchingOrders, 
    refreshOrders, 
    updateOrderStatus,
    updatePaymentStatus
  } = useAdminOrders();
  
  useEffect(() => {
    if (user) {
      // Initial loading is managed by the AdminAuthentication component
      setIsLoading(false);
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [user]);

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
          onStatusChange={updateOrderStatus}
          onPaymentStatusChange={updatePaymentStatus}
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
    <AdminLayout isLoading={isLoading}>
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
