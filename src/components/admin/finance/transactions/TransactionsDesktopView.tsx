
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TransactionsDesktopViewProps {
  transactions: any[];
}

const TransactionsDesktopView = ({ transactions }: TransactionsDesktopViewProps) => {
  return (
    <ScrollArea className="h-96">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10 border-b">
          <TableRow>
            <TableHead>ID Pedido</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Valor</TableHead>
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
                className="hover:bg-muted/30 transition-all duration-200"
              >
                <TableCell className="font-medium font-mono">#{orderId}</TableCell>
                <TableCell>{format(new Date(createdAt), "dd/MM/yy HH:mm")}</TableCell>
                <TableCell className="max-w-32 truncate">{customerName}</TableCell>
                <TableCell>{paymentMethod}</TableCell>
                <TableCell>
                  <Badge className={`${
                    paymentStatus === "completed" 
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-yellow-100 text-yellow-800 border-yellow-200"
                  }`}>
                    {paymentStatus === "completed" ? "Pago" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(orderTotal)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default TransactionsDesktopView;
