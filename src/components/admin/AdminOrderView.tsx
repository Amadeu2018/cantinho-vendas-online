
import React from "react";
import AdminOrderDetail from "@/components/admin/AdminOrderDetail";
import { Order as CartOrder } from "@/contexts/CartContext";

interface AdminOrderViewProps {
  order: CartOrder;
  onSelectOrder: (orderId: string | null) => void;
  onStatusChange: (orderId: string, status: string) => Promise<void>;
  onPaymentStatusChange: (orderId: string, status: string) => Promise<void>;
  onPrepareInvoice: (order: CartOrder) => void;
}

const AdminOrderView = ({ 
  order, 
  onSelectOrder, 
  onStatusChange,
  onPaymentStatusChange,
  onPrepareInvoice
}: AdminOrderViewProps) => {
  return (
    <div>
      <button 
        onClick={() => onSelectOrder(null)}
        className="mb-4 text-cantinho-terracotta hover:text-cantinho-terracotta/80 flex items-center"
      >
        &larr; Voltar para todos os pedidos
      </button>
      <AdminOrderDetail 
        order={order} 
        onStatusChange={onStatusChange}
        onPaymentStatusChange={onPaymentStatusChange}
        onPrepareInvoice={onPrepareInvoice}
      />
    </div>
  );
};

export default AdminOrderView;
