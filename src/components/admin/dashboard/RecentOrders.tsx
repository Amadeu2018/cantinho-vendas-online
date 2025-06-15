
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order } from "@/hooks/admin/use-orders-data";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecentOrdersProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
}

const RecentOrders = ({ orders, onSelectOrder }: RecentOrdersProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Pedidos Recentes</h2>
        </div>
        <div>
          {orders.slice(0, 4).map((order) => (
            <div 
              key={order.id}
              className="mobile-card-view cursor-pointer"
              onClick={() => onSelectOrder(order.id)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="mobile-card-label">ID</span>
                <span className="mobile-card-value font-mono text-xs">{order.id.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="mobile-card-label">Cliente</span>
                <span className="mobile-card-value">{order.customerInfo.name}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="mobile-card-label">Total</span>
                <span className="mobile-card-value">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                  }).format(order.total)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="mobile-card-label">Status</span>
                <span>
                  <Badge variant="outline" className={
                    order.paymentStatus === "completed" 
                      ? "bg-green-50 text-green-800 border-green-200" 
                      : "bg-yellow-50 text-yellow-800 border-yellow-200"
                  }>
                    {order.paymentStatus === "completed" ? "Pago" : "Pendente"}
                  </Badge>
                </span>
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
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 flex justify-end">
          <Button variant="link" className="text-sm text-cantinho-navy" onClick={() => window.scrollTo(0, 0)}>
            Ver todos
          </Button>
        </div>
      </Card>
    );
  }

  // layout normal em desktop/tablet
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Pedidos Recentes</h2>
        <Button variant="link" className="text-sm text-cantinho-navy">
          Ver todos
        </Button>
      </div>
      <div className="divide-y divide-gray-200">
        {orders.slice(0, 4).map((order) => (
          <div 
            key={order.id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onSelectOrder(order.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">#{order.id.slice(0, 10)}</p>
                <p className="text-sm text-gray-500">{order.customerInfo.name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                  }).format(order.total)}
                </p>
                <p className="text-sm text-gray-500">{order.status}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline" className={
                order.paymentStatus === "completed" 
                  ? "bg-green-50 text-green-800 border-green-200" 
                  : "bg-yellow-50 text-yellow-800 border-yellow-200"
              }>
                {order.paymentStatus === "completed" ? "Pago" : "Pendente"}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentOrders;
