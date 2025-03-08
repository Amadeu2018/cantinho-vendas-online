
import { useState } from "react";
import { Order, OrderStatus } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdminOrderDetailProps = {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: string, status: "pending" | "completed") => void;
};

// Helper for formatting prices
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
};

// Helper for getting status badge color
const getStatusBadgeColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "confirmed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "preparing":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
    case "delivering":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

// Helper for getting payment status badge color
const getPaymentBadgeColor = (status: "pending" | "completed") => {
  return status === "completed" 
    ? "bg-green-100 text-green-800 hover:bg-green-100" 
    : "bg-orange-100 text-orange-800 hover:bg-orange-100";
};

const AdminOrderDetail = ({ 
  order, 
  onStatusChange, 
  onPaymentStatusChange 
}: AdminOrderDetailProps) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<"pending" | "completed">(order.paymentStatus);
  
  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange(order.id, newStatus);
  };
  
  const handlePaymentStatusChange = (newStatus: "pending" | "completed") => {
    setCurrentPaymentStatus(newStatus);
    onPaymentStatusChange(order.id, newStatus);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h3 className="text-xl font-bold">Pedido: {order.id}</h3>
          <p className="text-muted-foreground">
            {format(new Date(order.createdAt), "PPP 'às' p", { locale: ptBR })}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <div>
            <span className="text-sm block mb-1">Status do Pedido</span>
            <Select 
              value={currentStatus} 
              onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="preparing">Em Preparo</SelectItem>
                <SelectItem value="delivering">Em Entrega</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <span className="text-sm block mb-1">Status do Pagamento</span>
            <Select 
              value={currentPaymentStatus} 
              onValueChange={(value) => handlePaymentStatusChange(value as "pending" | "completed")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="completed">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-muted/20 p-4 rounded-md">
          <h4 className="font-medium mb-2">Informações do Cliente</h4>
          <div className="space-y-1">
            <p><span className="font-medium">Nome:</span> {order.customerInfo.name}</p>
            <p><span className="font-medium">Telefone:</span> {order.customerInfo.phone}</p>
            <p><span className="font-medium">Endereço:</span> {order.customerInfo.address}</p>
            {order.customerInfo.notes && (
              <p><span className="font-medium">Notas:</span> {order.customerInfo.notes}</p>
            )}
          </div>
        </div>
        
        <div className="bg-muted/20 p-4 rounded-md">
          <h4 className="font-medium mb-2">Informações da Entrega</h4>
          <div className="space-y-1">
            <p><span className="font-medium">Local:</span> {order.location.name}</p>
            <p><span className="font-medium">Taxa:</span> {formatPrice(order.location.fee)}</p>
            <p><span className="font-medium">Tempo estimado:</span> {order.location.estimatedTime}</p>
            <p>
              <span className="font-medium">Método de pagamento:</span> {order.paymentMethod.name}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3">Itens do Pedido</h4>
        <div className="bg-white border rounded-md">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center p-3 border-b last:border-b-0">
              <div className="w-12 h-12 bg-muted rounded-md overflow-hidden mr-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} x {item.quantity}
                </p>
              </div>
              <div className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-muted/10 p-4 rounded-md">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de Entrega</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <Badge className={getStatusBadgeColor(order.status)}>
            Status: {currentStatus === "pending" ? "Pendente" : 
                     currentStatus === "confirmed" ? "Confirmado" :
                     currentStatus === "preparing" ? "Em Preparo" :
                     currentStatus === "delivering" ? "Em Entrega" :
                     currentStatus === "completed" ? "Concluído" : "Cancelado"}
          </Badge>
          <Badge className={getPaymentBadgeColor(order.paymentStatus)}>
            Pagamento: {currentPaymentStatus === "completed" ? "Pago" : "Pendente"}
          </Badge>
        </div>
        
        {order.status !== "cancelled" && order.status !== "completed" && (
          <Button 
            variant="destructive" 
            onClick={() => handleStatusChange("cancelled")}
          >
            Cancelar Pedido
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetail;
