
import { Order } from "@/hooks/admin/use-orders-data";
import { Order as CartOrder } from "@/contexts/CartContext";

export const convertOrderType = (order: Order): CartOrder => {
  return {
    ...order,
    notes: order.notes || "",
    status: order.status === 'delivered' ? 'delivering' : order.status,
    location: {
      ...order.location,
      id: order.location?.id?.toString() || "default-location" // Convert to string
    },
    paymentMethod: {
      id: order.paymentMethod?.id || 'default-id',
      name: order.paymentMethod?.name || 'Método de pagamento',
      icon: order.paymentMethod?.icon || 'credit-card'
    }
  };
};

export const getTitle = (activeTab: string, selectedOrder: Order | null, selectedInvoiceOrder: CartOrder | null) => {
  if (selectedOrder) {
    return `Pedido #${selectedOrder.id.slice(0, 8)}`;
  }
  if (selectedInvoiceOrder) {
    return "Fatura";
  }
  
  const titleMap: { [key: string]: string } = {
    dashboard: "Dashboard",
    orders: "Pedidos",
    products: "Produtos",
    customers: "Clientes",
    finance: "Finanças",
    inventory: "Estoque",
    reports: "Relatórios",
    settings: "Configurações",
    events: "Eventos"
  };
  
  return titleMap[activeTab] || "Dashboard";
};
