
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
    <div className="space-y-4 md:space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 break-words">
            Pedido #{order.id}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">{formattedDate}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 text-xs md:text-sm h-8 md:h-9 px-3 md:px-4"
            onClick={() => onPrepareInvoice(order)}
          >
            <Printer className="h-3 w-3 md:h-4 md:w-4" />
            <span>Gerar Fatura</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 text-xs md:text-sm h-8 md:h-9 px-3 md:px-4"
            onClick={() => onPrepareInvoice({...order, isProforma: true})}
          >
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            <span>Proforma</span>
          </Button>
        </div>
      </div>
      
      {/* Cliente e Entrega */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="min-w-0">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-sm md:text-base lg:text-lg">Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3 text-xs md:text-sm">
            <div className="break-words">
              <span className="font-medium text-gray-700">Nome:</span>
              <span className="ml-2 text-gray-900">{order.customerInfo.name}</span>
            </div>
            <div className="break-words">
              <span className="font-medium text-gray-700">Endereço:</span>
              <span className="ml-2 text-gray-900">{order.customerInfo.address}</span>
            </div>
            <div className="break-words">
              <span className="font-medium text-gray-700">Telefone:</span>
              <span className="ml-2 text-gray-900">{order.customerInfo.phone}</span>
            </div>
            {order.customerInfo.notes && (
              <div className="break-words">
                <span className="font-medium text-gray-700">Observações:</span>
                <span className="ml-2 text-gray-900">{order.customerInfo.notes}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="min-w-0">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-sm md:text-base lg:text-lg">Detalhes da Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3 text-xs md:text-sm">
            <div>
              <span className="font-medium text-gray-700">Local:</span>
              <span className="ml-2 text-gray-900">{order.location.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Taxa de Entrega:</span>
              <span className="ml-2 text-gray-900">{formatCurrency(order.location.fee)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tempo Estimado:</span>
              <span className="ml-2 text-gray-900">{order.location.estimatedTime}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Itens do Pedido */}
      <Card className="min-w-0">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-sm md:text-base lg:text-lg">Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-2 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{item.name}</p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-semibold text-gray-900 text-sm md:text-base sm:text-right">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-gray-600">Taxa de Entrega</span>
              <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
            </div>
            <Separator className="my-2 md:my-3" />
            <div className="flex justify-between font-bold text-sm md:text-base lg:text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Status do Pedido */}
      <Card className="min-w-0">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-sm md:text-base lg:text-lg">Status do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4">
            <div className="flex items-center">
              <Badge className={`${statusDisplay[order.status].color} text-white text-xs md:text-sm`}>
                {statusDisplay[order.status].label}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {order.status !== "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("pending")}
                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                >
                  <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 
                  Pendente
                </Button>
              )}
              {order.status !== "confirmed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("confirmed")}
                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                >
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 
                  Confirmar
                </Button>
              )}
              {order.status !== "preparing" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("preparing")}
                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                >
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 
                  Preparo
                </Button>
              )}
              {order.status !== "delivering" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("delivering")}
                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                >
                  <Truck className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 
                  Entrega
                </Button>
              )}
              {order.status !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("completed")}
                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                >
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 
                  Finalizar
                </Button>
              )}
              {order.status !== "cancelled" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("cancelled")}
                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Ban className="h-3 w-3 md:h-4 md:w-4 mr-1" /> 
                  Cancelar
                </Button>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 md:gap-4">
            <div className="flex items-center">
              <Badge className={`${paymentStatusDisplay[order.paymentStatus].color} text-white text-xs md:text-sm`}>
                {paymentStatusDisplay[order.paymentStatus].label}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {order.paymentStatus !== "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePaymentStatusChange("pending")}
                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                >
                  Marcar Pendente
                </Button>
              )}
              {order.paymentStatus !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePaymentStatusChange("completed")}
                  className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
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
