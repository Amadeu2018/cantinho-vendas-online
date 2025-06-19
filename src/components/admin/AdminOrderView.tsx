
import React from "react";
import AdminOrderDetail from "@/components/admin/AdminOrderDetail";
import OrdersLayout from "./orders/OrdersLayout";
import { Order as CartOrder } from "@/contexts/CartContext";

interface AdminOrderViewProps {
  order: CartOrder;
  onSelectOrder: (orderId: string | null) => void;
  onStatusChange: (orderId: string, status: string) => Promise<void>;
  onPaymentStatusChange: (orderId: string, status: string) => Promise<void>;
  onPrepareInvoice: (order: CartOrder) => void;
  totalOrders?: number;
  pendingOrders?: number;
}

const AdminOrderView = ({ 
  order, 
  onSelectOrder, 
  onStatusChange,
  onPaymentStatusChange,
  onPrepareInvoice,
  totalOrders = 0,
  pendingOrders = 0
}: AdminOrderViewProps) => {
  return (
    <OrdersLayout
      selectedOrderId={order.id}
      onBackToList={() => onSelectOrder(null)}
      totalOrders={totalOrders}
      pendingOrders={pendingOrders}
    >
      <div className="p-4">
        <AdminOrderDetail 
          order={order} 
          onStatusChange={onStatusChange}
          onPaymentStatusChange={onPaymentStatusChange}
          onPrepareInvoice={onPrepareInvoice}
        />
      </div>
    </OrdersLayout>
  );
};

export default AdminOrderView;
