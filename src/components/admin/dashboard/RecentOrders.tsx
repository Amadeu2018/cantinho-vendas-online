
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order } from "@/hooks/admin/use-orders-data";

interface RecentOrdersProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
}

const RecentOrders = ({ orders, onSelectOrder }: RecentOrdersProps) => {
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
