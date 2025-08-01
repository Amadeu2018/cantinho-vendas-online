
import { Order } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminOrdersMobile from "./AdminOrdersMobile";

type AdminOrdersProps = {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
};

// Helper for formatting prices
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
};

// Helper for getting status badge color
const getStatusBadgeColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200";
    case "confirmed":
      return "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200";
    case "preparing":
      return "bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-200";
    case "delivering":
      return "bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200";
    case "delivered":
      return "bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-200";
    case "completed":
      return "bg-green-50 text-green-700 hover:bg-green-50 border-green-200";
    case "cancelled":
      return "bg-red-50 text-red-700 hover:bg-red-50 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200";
  }
};

// Helper for getting payment status badge color
const getPaymentBadgeColor = (status: "pending" | "completed" | "failed" | "cancelled") => {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700 hover:bg-green-50 border-green-200";
    case "failed":
      return "bg-red-50 text-red-700 hover:bg-red-50 border-red-200";
    case "cancelled":
      return "bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200";
    default:
      return "bg-orange-50 text-orange-700 hover:bg-orange-200";
  }
};

// Helper for formatting status names
const formatStatus = (status: Order["status"]) => {
  const statusMap: Record<Order["status"], string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    preparing: "Em Preparo",
    delivering: "Em Entrega",
    delivered: "Entregue",
    completed: "Concluído",
    cancelled: "Cancelado"
  };
  
  return statusMap[status] || status;
};

// Helper for formatting payment status
const formatPaymentStatus = (status: "pending" | "completed" | "failed" | "cancelled") => {
  const statusMap = {
    completed: "Pago",
    failed: "Falhou",
    cancelled: "Cancelado",
    pending: "Pendente"
  };
  return statusMap[status] || status;
};

const AdminOrders = ({ orders, onSelectOrder }: any) => {
  const isMobile = useIsMobile();
  // Sort orders by date, most recent first
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  if (isMobile) {
    return <AdminOrdersMobile orders={sortedOrders} onSelectOrder={onSelectOrder} />;
  }
  
  if (sortedOrders.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm">
          Nenhum pedido encontrado nesta categoria.
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-[700px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-b uppercase tracking-wider">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-b uppercase tracking-wider">Cliente</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-b uppercase tracking-wider">Data</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-b uppercase tracking-wider">Total</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-b uppercase tracking-wider">Status</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-b uppercase tracking-wider">Pagamento</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-700 border-b uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs text-gray-600">{order.id.slice(0, 8)}...</span>
                </td>
                <td className="px-3 py-4">
                  <div className="max-w-[140px]">
                    <p className="font-medium text-gray-900 text-sm truncate">{order.customerInfo.name}</p>
                    <p className="text-xs text-gray-500 truncate">{order.customerInfo.phone}</p>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className="text-xs text-gray-600">
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className="font-semibold text-gray-900 text-sm">{formatPrice(order.total)}</span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Badge variant="outline" className={`text-xs ${getStatusBadgeColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </Badge>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Badge variant="outline" className={`text-xs ${getPaymentBadgeColor(order.paymentStatus)}`}>
                    {formatPaymentStatus(order.paymentStatus)}
                  </Badge>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelectOrder(order.id)}
                    className="text-xs border-cantinho-navy text-cantinho-navy hover:bg-cantinho-navy hover:text-white h-7 px-2"
                  >
                    Ver Detalhes
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
