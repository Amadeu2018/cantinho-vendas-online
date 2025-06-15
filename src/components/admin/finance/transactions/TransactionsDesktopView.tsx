
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SmoothScrollArea } from "@/components/ui/smooth-scroll-area";

interface TransactionsDesktopViewProps {
  transactions: any[];
}

const TransactionsDesktopView = ({ transactions }: TransactionsDesktopViewProps) => {
  return (
    <SmoothScrollArea className="h-96" fadeEdges>
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10 border-b">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-gray-900">ID Pedido</TableHead>
            <TableHead className="font-semibold text-gray-900">Data</TableHead>
            <TableHead className="font-semibold text-gray-900">Cliente</TableHead>
            <TableHead className="font-semibold text-gray-900">Método</TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
            <TableHead className="text-right font-semibold text-gray-900">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
              <TableRow 
                key={order.id} 
                className="hover:bg-muted/30 transition-all duration-200 group"
              >
                <TableCell className="font-medium font-mono group-hover:text-cantinho-navy transition-colors">
                  #{orderId}
                </TableCell>
                <TableCell className="group-hover:text-cantinho-navy transition-colors">
                  <div>
                    <div className="font-medium">
                      {format(new Date(createdAt), "dd/MM/yy")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(createdAt), "HH:mm")}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-32 truncate group-hover:text-cantinho-navy transition-colors">
                  {customerName}
                </TableCell>
                <TableCell className="group-hover:text-cantinho-navy transition-colors">
                  <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {paymentMethod}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={`transition-all duration-200 ${
                    paymentStatus === "completed" 
                      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
                  }`}>
                    {paymentStatus === "completed" ? "Pago" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-cantinho-navy">
                  {formatCurrency(orderTotal)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </SmoothScrollArea>
  );
};

export default TransactionsDesktopView;
