
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
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

const formatPaymentStatus = (status: string) => {
  const statusMap = {
    completed: "Pago",
    failed: "Falhou",
    cancelled: "Cancelado",
    pending: "Pendente"
  };
  return statusMap[status] || status;
};

const AdminOrdersMobile = ({ orders, onSelectOrder }: any) => {
  if (!orders.length) {
    return (
      <div className="bg-gray-50 rounded-lg p-10 text-center">
        <p className="text-gray-500">Nenhum pedido encontrado nesta categoria.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <div key={order.id} className="mobile-card-view cursor-pointer" onClick={() => onSelectOrder(order.id)}>
          <div className="flex justify-between items-center mb-1">
            <span className="mobile-card-label">ID Pedido</span>
            <span className="mobile-card-value font-mono text-xs">{order.id.slice(0, 10)}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="mobile-card-label">Cliente</span>
            <span className="mobile-card-value">{order.customerInfo.name}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="mobile-card-label">Total</span>
            <span className="mobile-card-value">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="mobile-card-label">Status</span>
            <Badge variant="outline">{formatStatus(order.status)}</Badge>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="mobile-card-label">Pagamento</span>
            <Badge variant="outline">{formatPaymentStatus(order.paymentStatus)}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="mobile-card-label">Criado</span>
            <span className="mobile-card-value text-xs">
              {formatDistanceToNow(new Date(order.createdAt), {
                addSuffix: true,
                locale: ptBR
              })}
            </span>
          </div>
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onSelectOrder(order.id);
              }}
            >
              Detalhes
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersMobile;
