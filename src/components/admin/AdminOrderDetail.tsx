
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order, OrderStatus, PaymentStatus } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Check, FileText, Printer, Truck, Clock, Ban } from "lucide-react";

type AdminOrderDetailProps = {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: string, status: PaymentStatus) => void;
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
  
  const handlePaymentStatusChange = (status: PaymentStatus) => {
    onPaymentStatusChange(order.id, status);
  };

  const handlePrepareInvoice = (isProforma: boolean = false) => {
    // Create a copy of the order with the isProforma flag
    const orderCopy = {
      ...order,
      isProforma
    };
    onPrepareInvoice(orderCopy);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Pedido #{order.id}</h3>
          <p className="text-gray-500">{formattedDate}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handlePrepareInvoice(false)}
          >
            <Printer className="h-4 w-4" />
            Gerar Fatura
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handlePrepareInvoice(true)}
          >
            <FileText className="h-4 w-4" />
            Proforma
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
        
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
      
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded overflow-hidden">
                    <img src={item.image || item.image_url || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} x {item.quantity}</p>
                  </div>
                </div>
                <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Entrega</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Status do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className={`${statusDisplay[order.status].color}`}>
                {statusDisplay[order.status].label}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              {order.status !== "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("pending")}
                >
                  <Clock className="h-4 w-4 mr-1" /> Marcar como Pendente
                </Button>
              )}
              
              {order.status !== "confirmed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("confirmed")}
                >
                  <Check className="h-4 w-4 mr-1" /> Confirmar Pedido
                </Button>
              )}
              
              {order.status !== "preparing" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("preparing")}
                >
                  <Check className="h-4 w-4 mr-1" /> Em Preparo
                </Button>
              )}
              
              {order.status !== "delivering" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("delivering")}
                >
                  <Truck className="h-4 w-4 mr-1" /> Em Entrega
                </Button>
              )}
              
              {order.status !== "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("completed")}
                >
                  <Check className="h-4 w-4 mr-1" /> Completar
                </Button>
              )}
              
              {order.status !== "cancelled" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("cancelled")}
                >
                  <Ban className="h-4 w-4 mr-1" /> Cancelar
                </Button>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className={`${paymentStatusDisplay[order.paymentStatus].color}`}>
                {paymentStatusDisplay[order.paymentStatus].label}
              </Badge>
            </div>
            
            <div className="flex gap-2">
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
