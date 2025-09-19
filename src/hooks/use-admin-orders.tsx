
import { useOrdersData } from './admin/use-orders-data';
import { useOrdersNotifications } from './admin/use-orders-notifications';
import { useStockNotifications } from './admin/use-stock-notifications';
import { useOrdersActions } from './admin/use-orders-actions';

export type { Order } from './admin/use-orders-data';

export const useAdminOrders = () => {
  const { orders, isLoading, error, refreshOrders, setOrders } = useOrdersData();
  const { updateOrderStatus, updatePaymentStatus } = useOrdersActions(orders, setOrders);
  
  // Set up notifications
  useOrdersNotifications({ refreshOrders });
  useStockNotifications();

  return { 
    orders, 
    isLoading, 
    error, 
    refreshOrders,
    updateOrderStatus,
    updatePaymentStatus
  };
};

export default useAdminOrders;
