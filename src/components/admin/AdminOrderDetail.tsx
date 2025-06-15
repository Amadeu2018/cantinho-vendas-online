import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order, OrderStatus } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Check, FileText, Printer, Truck, Clock, Ban } from "lucide-react";

type AdminOrderDetailProps = {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: string, status: "pending" | "completed") => void;
  onPrepareInvoice: (order: Order) => void;
};

const statusDisplay = {
  pending: { label: "Pendente", color: "bg-yellow-500" },
  confirmed: { label: "Confirmado", color: "bg-blue-500" },
  preparing: { label: "Em Preparo", color: "bg-purple-500" },
  delivering: { label: "Em Entrega", color: "bg-orange-500" },
  completed: { label: "Concluído", color: "bg-green-500" },
  cancelled: { label: "Cancelado", color: "bg-red-500" },
};

const paymentStatusDisplay = {
  pending: { label: "Pagamento Pendente", color: "bg-orange-500" },
  completed: { label: "Pagamento Concluído", color: "bg-green-500" },
};

const AdminOrderDetail = ({ 
  order, 
  onStatusChange, 
  onPaymentStatusChange,
  onPrepareInvoice
}: AdminOrderDetailProps) => {
  const date = new Date(order.createdAt);
  const formattedDate = format(date, "PPP 'às' p", { locale: ptBR });
  
  const handleStatusChange = (status: OrderStatus) => {
    onStatusChange(order.id, status);
  };
  
  const handlePaymentStatusChange = (status: "pending" | "completed") => {
    onPaymentStatusChange(order.id, status);
  };

  return (
    <div className="space-y-6 px-1 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold break-all">Pedido #{order.id}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div className="flex gap-2 flex-col xs:flex-row w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full xs:w-auto"
            onClick={() => onPrepareInvoice(order)}
          >
            <Printer className="h-4 w-4" />
            <span className="hidden xs:inline">Gerar Fatura</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full xs:w-auto"
            onClick={() => onPrepareInvoice({...order, isProforma: true})}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden xs:inline">Proforma</span>
          </Button>
        </div>
      </div>
      
      {/* Cliente e Entrega */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs sm:text-sm break-words">
            <div>
              <span className="font-medium">Nome:</span> {order.customerInfo.name}
            </div>
            <div>
              <span className="font-medium">Endereço:</span> {order.customerInfo.address}
            </div>
            <div>
              <span className="font-medium">Telefone:</span> {order.customerInfo.phone}
            </div>
            {order.customerInfo.notes && (
              <div>
                <span className="font-medium">Observações:</span> {order.customerInfo.notes}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Detalhes da Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs sm:text-sm">
            <div>
              <span className="font-medium">Local:</span> {order.location.name}
            </div>
            <div>
              <span className="font-medium">Taxa de Entrega:</span> {formatCurrency(order.location.fee)}
            </div>
            <div>
              <span className="font-medium">Tempo Estimado:</span> {order.location.estimatedTime}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Itens do Pedido */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex flex-col xs:flex-row xs:items-center xs:justify-between border-b pb-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{formatCurrency(item.price)} x {item.quantity}</p>
                  </div>
                </div>
                <div className="font-medium xs:text-right">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span>Taxa de Entrega</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-sm sm:text-base">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Status do Pedido */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Status do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge className={`${statusDisplay[order.status].color}`}>
                {statusDisplay[order.status].label}
              </Badge>
            </div>
            <div className="flex gap-2 flex-col xs:flex-row flex-wrap w-full sm:w-auto">
              {order.status !== "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("pending")}
                >
                  <Clock className="h-4 w-4 mr-1" /> 
                  <span className="hidden xs:inline">Marcar como Pendente</span>
                  <span className="inline xs:hidden">Pendente</span>
                </Button>
              )}
              {order.status !== "confirmed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("confirmed")}
                >
                  <Check className="h-4 w-4 mr-1" /> 
                  <span className="hidden xs:inline">Confirmar Pedido</span>
                  <span className="inline xs:hidden">Confirmar</span>
                </Button>
              )}
              {order.status !== "preparing" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("preparing")}
                >
                  <Check className="h-4 w-4 mr-1" /> 
                  <span className="hidden xs:inline">Em Preparo</span>
                  <span className="inline xs:hidden">Preparo</span>
                </Button>
              )}
              {order.status !== "delivering" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("delivering")}
                >
                  <Truck className="h-4 w-4 mr-1" /> 
                  <span className="hidden xs:inline">Em Entrega</span>
                  <span className="inline xs:hidden">Entrega</span>
                </Button>
              )}
              {order.status !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("completed")}
                >
                  <Check className="h-4 w-4 mr-1" /> 
                  <span className="hidden xs:inline">Completar</span>
                  <span className="inline xs:hidden">Finalizar</span>
                </Button>
              )}
              {order.status !== "cancelled" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("cancelled")}
                >
                  <Ban className="h-4 w-4 mr-1" /> 
                  <span className="hidden xs:inline">Cancelar</span>
                </Button>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge className={`${paymentStatusDisplay[order.paymentStatus].color}`}>
                {paymentStatusDisplay[order.paymentStatus].label}
              </Badge>
            </div>
            <div className="flex gap-2 flex-col xs:flex-row flex-wrap w-full sm:w-auto">
              {order.paymentStatus !== "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePaymentStatusChange("pending")}
                >
                  Marcar como Pendente
                </Button>
              )}
              {order.paymentStatus !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePaymentStatusChange("completed")}
                >
                  Confirmar Pagamento
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderDetail;
