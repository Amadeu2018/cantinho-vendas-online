
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, CreditCard, Clock, Package, Eye, Phone } from "lucide-react";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "preparing":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivering":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-orange-100 text-orange-800 border-orange-200";
  }
};

const AdminOrdersMobile = ({ orders, onSelectOrder }: any) => {
  if (!orders.length) {
    return (
      <div className="text-center py-12 px-4">
        <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-base">Nenhum pedido encontrado</p>
        <p className="text-gray-400 text-sm mt-1">Os pedidos aparecerão aqui quando forem criados</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 px-2">
      {orders.map((order: any) => (
        <div 
          key={order.id} 
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm active:shadow-md transition-shadow touch-manipulation"
          onClick={() => onSelectOrder(order.id)}
        >
          <div className="space-y-4">
            {/* Header com ID e valor */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="font-mono text-xs text-gray-600">#{order.id.slice(0, 8)}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</span>
            </div>
            
            {/* Informações do cliente */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium text-gray-900 text-base truncate">{order.customerInfo.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{order.customerInfo.phone}</span>
                  </div>
                </div>
              </div>
              
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`text-xs px-2 py-1 ${getStatusColor(order.status)}`}>
                  {formatStatus(order.status)}
                </Badge>
                <Badge variant="outline" className={`text-xs px-2 py-1 ${getPaymentStatusColor(order.paymentStatus)}`}>
                  <CreditCard className="h-3 w-3 mr-1" />
                  {formatPaymentStatus(order.paymentStatus)}
                </Badge>
              </div>
              
              {/* Tempo desde criação */}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(order.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </div>
            
            {/* Botão de ação */}
            <div className="pt-3 border-t border-gray-100">
              <Button
                size="sm"
                variant="outline"
                className="w-full h-10 text-sm font-medium justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOrder(order.id);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersMobile;
