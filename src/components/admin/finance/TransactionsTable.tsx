
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface TransactionsTableProps {
  orders: any[];
}

const TransactionsTable = ({ orders }: TransactionsTableProps) => {
  const recentTransactions = orders
    .filter(order => order.status !== "cancelled")
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt);
      const dateB = new Date(b.created_at || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
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
            {recentTransactions.length > 0 ? (
              recentTransactions.map((order) => {
                let customerName = "Cliente";
                let paymentMethod = "Desconhecido";
                let paymentStatus = order.payment_status || order.paymentStatus || "pending";
                const createdAt = order.created_at || order.createdAt;
                const orderId = typeof order.id === 'string' ? order.id.slice(0, 8) : order.id;
                
                try {
                  // Handle customer info
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
                  
                  // Handle payment method
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
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{orderId}</TableCell>
                    <TableCell>{format(new Date(createdAt), "dd/MM/yy HH:mm")}</TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>{paymentMethod}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        paymentStatus === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {paymentStatus === "completed" ? "Pago" : "Pendente"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(orderTotal)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nenhuma transação disponível
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
