
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, CreditCard } from "lucide-react";

interface TransactionsMobileViewProps {
  transactions: any[];
}

const TransactionsMobileView = ({ transactions }: TransactionsMobileViewProps) => {
  return (
    <ScrollArea className="h-96">
      <div className="space-y-3 pr-2">
        {transactions.map((order) => {
          let customerName = "Cliente";
          let paymentMethod = "Desconhecido";
          let paymentStatus = order.payment_status || order.paymentStatus || "pending";
          const createdAt = order.created_at || order.createdAt;
          const orderId = typeof order.id === 'string' ? order.id.slice(0, 8) : order.id;
          
          try {
            if (order.customer_info && typeof order.customer_info === 'string') {
              try {
                const info = JSON.parse(order.customer_info);
                customerName = info.name || "Cliente";
              } catch (e) {
                customerName = order.customer_info;
              }
            } else if (order.customer_info?.name) {
              customerName = order.customer_info.name;
            } else if (order.customerInfo?.name) {
              customerName = order.customerInfo.name;
            }
            
            if (order.payment_method && typeof order.payment_method === 'string') {
              paymentMethod = order.payment_method;
            } else if (order.payment_method?.name) {
              paymentMethod = order.payment_method.name;
            } else if (order.paymentMethod?.name) {
              paymentMethod = order.paymentMethod.name;
            }
          } catch (e) {
            console.error("Error parsing order data:", e);
          }
          
          const orderTotal = typeof order.total === 'number' ? order.total : 
                            typeof order.total === 'string' ? parseFloat(order.total) : 0;
          
          return (
            <div 
              key={order.id} 
              className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-sm transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-medium text-gray-900">#{orderId}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(createdAt), "dd/MM/yy HH:mm")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatCurrency(orderTotal)}</p>
                  <Badge className={`text-xs ${
                    paymentStatus === "completed" 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }`}>
                    {paymentStatus === "completed" ? "Pago" : "Pendente"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-20">{customerName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  <span>{paymentMethod}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default TransactionsMobileView;
