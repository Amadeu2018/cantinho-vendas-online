
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SmoothScrollArea } from "@/components/ui/smooth-scroll-area";
import { User, CreditCard, Calendar, Hash } from "lucide-react";

interface TransactionsMobileViewProps {
  transactions: any[];
}

const TransactionsMobileView = ({ transactions }: TransactionsMobileViewProps) => {
  return (
    <SmoothScrollArea className="h-96" fadeEdges>
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
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-100 hover:border-cantinho-terracotta/20"
            >
              {/* Header with ID and Amount */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-3 w-3 text-gray-400" />
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {orderId}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-cantinho-navy">
                    {formatCurrency(orderTotal)}
                  </div>
                  <Badge className={`text-xs transition-colors ${
                    paymentStatus === "completed" 
                      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                      : "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
                  }`}>
                    {paymentStatus === "completed" ? "Pago" : "Pendente"}
                  </Badge>
                </div>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <div>
                    <div className="text-gray-500 text-xs">Data</div>
                    <div className="font-medium text-gray-900">
                      {format(new Date(createdAt), "dd/MM/yy")}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {format(new Date(createdAt), "HH:mm")}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <User className="h-3 w-3 text-gray-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-500 text-xs">Cliente</div>
                    <div className="font-medium text-gray-900 truncate">
                      {customerName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-3 flex items-center gap-2 bg-gradient-to-r from-cantinho-sky/10 to-cantinho-sage/10 rounded-lg p-2">
                <CreditCard className="h-3 w-3 text-cantinho-navy" />
                <div>
                  <div className="text-xs text-gray-500">Método de Pagamento</div>
                  <div className="text-sm font-medium text-cantinho-navy">
                    {paymentMethod}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SmoothScrollArea>
  );
};

export default TransactionsMobileView;
