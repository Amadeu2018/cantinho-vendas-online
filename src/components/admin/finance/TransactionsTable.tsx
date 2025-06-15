
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Receipt, User, CreditCard, ArrowUp } from "lucide-react";
import { SmoothScrollArea } from "@/components/ui/smooth-scroll-area";
import { useScrollTransitions, useScrollToTop } from "@/hooks/use-scroll-transitions";
import { Button } from "@/components/ui/button";

interface TransactionsTableProps {
  orders: any[];
}

const TransactionsTable = ({ orders }: TransactionsTableProps) => {
  const isMobile = useIsMobile();
  const { registerItem } = useScrollTransitions({ enableFadeTransitions: true });
  const { scrollToTop } = useScrollToTop();
  
  const recentTransactions = orders
    .filter(order => order.status !== "cancelled")
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt);
      const dateB = new Date(b.created_at || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 20);

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Receipt className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">Nenhuma transação</h3>
          <p className="text-muted-foreground">Não há transações disponíveis para o período selecionado</p>
        </CardContent>
      </Card>
    );
  }

  // Mobile View - Cards com scroll suave
  if (isMobile) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Histórico de Transações
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => scrollToTop()}
              className="h-8 w-8 p-0"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <SmoothScrollArea className="h-96" showScrollbar={true} fadeEdges={true}>
            <div className="space-y-3 pr-2">
              {recentTransactions.map((order, index) => {
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
                  <div 
                    key={order.id} 
                    className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-sm transform hover:scale-[1.02]"
                    ref={(el) => registerItem(`transaction-${index}`, el)}
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
          </SmoothScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Desktop/Tablet View - Table com scroll suave
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Histórico de Transações
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => scrollToTop()}
            className="h-8 w-8 p-0"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <SmoothScrollArea className="h-96" showScrollbar={true} fadeEdges={true}>
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
              {recentTransactions.map((order, index) => {
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
                    ref={(el) => registerItem(`transaction-row-${index}`, el)}
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
        </SmoothScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
