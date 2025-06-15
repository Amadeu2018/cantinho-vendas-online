
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
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm">Nenhum pedido encontrado nesta categoria.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {orders.map((order: any) => (
        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">ID Pedido</span>
              <span className="font-mono text-xs text-gray-900">{order.id.slice(0, 10)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Cliente</span>
              <span className="text-sm font-medium text-right min-w-0 truncate">{order.customerInfo.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Total</span>
              <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Status</span>
              <Badge variant="outline" className="text-xs">{formatStatus(order.status)}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Pagamento</span>
              <Badge variant="outline" className="text-xs">{formatPaymentStatus(order.paymentStatus)}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Criado</span>
              <span className="text-xs text-gray-600">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
            
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectOrder(order.id)}
                className="text-xs h-7 px-2"
              >
                Detalhes
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersMobile;
