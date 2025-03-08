
import { Order } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "confirmed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "preparing":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
    case "delivering":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

// Helper for getting payment status badge color
const getPaymentBadgeColor = (status: "pending" | "completed") => {
  return status === "completed" 
    ? "bg-green-100 text-green-800 hover:bg-green-100" 
    : "bg-orange-100 text-orange-800 hover:bg-orange-100";
};

// Helper for formatting status names
const formatStatus = (status: Order["status"]) => {
  const statusMap: Record<Order["status"], string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    preparing: "Em Preparo",
    delivering: "Em Entrega",
    completed: "Concluído",
    cancelled: "Cancelado"
  };
  
  return statusMap[status] || status;
};

// Helper for formatting payment status
const formatPaymentStatus = (status: "pending" | "completed") => {
  return status === "completed" ? "Pago" : "Pendente";
};

const AdminOrders = ({ orders, onSelectOrder }: AdminOrdersProps) => {
  // Sort orders by date, most recent first
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedOrders.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-10 text-center">
        <p className="text-muted-foreground">
          Nenhum pedido encontrado nesta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/30">
            <th className="px-4 py-3 text-left">ID Pedido</th>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-left">Data</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Pagamento</th>
            <th className="px-4 py-3 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/20">
              <td className="px-4 py-3">
                <span className="font-mono text-sm">{order.id.slice(0, 10)}...</span>
              </td>
              <td className="px-4 py-3">{order.customerInfo.name}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </td>
              <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
              <td className="px-4 py-3">
                <Badge className={getStatusBadgeColor(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge className={getPaymentBadgeColor(order.paymentStatus)}>
                  {formatPaymentStatus(order.paymentStatus)}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Button variant="outline" size="sm" onClick={() => onSelectOrder(order.id)}>
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
