
import { useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAuthentication from "@/components/admin/AdminAuthentication";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOrderView from "@/components/admin/AdminOrderView";
import AdminInvoiceView from "@/components/admin/AdminInvoiceView";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { useToast } from "@/hooks/use-toast";
import { useAdminState } from "@/hooks/use-admin-state";
import { convertOrderType, getTitle } from "@/utils/admin-helpers";

const Admin = () => {
  const { toast } = useToast();
  const {
    isAuthenticated,
    selectedOrderId,
    selectedInvoiceOrder,
    activeTab,
    setActiveTab,
    handleAuthentication,
    handleLogout,
    handleSelectOrder,
    handlePrepareInvoice,
    handleBackFromInvoice
  } = useAdminState();
  
  const { 
    orders, 
    isLoading: fetchingOrders, 
    refreshOrders, 
    updateOrderStatus,
    updatePaymentStatus
  } = useAdminOrders();

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        refreshOrders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refreshOrders]);
  
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId) || null;
  };
  
  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null;

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
        orders={orders}
        fetchingOrders={fetchingOrders}
        onSelectOrder={orderId => handleSelectOrder(orderId)}
        onPrepareInvoice={(order) => handlePrepareInvoice(convertOrderType(order))}
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
    <AdminLayout 
      onLogout={handleLogout} 
      title={getTitle(activeTab, selectedOrder, selectedInvoiceOrder)}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
