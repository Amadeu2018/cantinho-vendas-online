
import { useState, useEffect } from "react";
import { useCart, Order } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, Clock, Truck, ChefHat, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type OrderStatusProps = {
  orderId: string;
  onBackToShopping: () => void;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
};

const OrderStatus = ({ orderId, onBackToShopping }: OrderStatusProps) => {
  const { getOrderById } = useCart();
  const [order, setOrder] = useState<Order | undefined>(getOrderById(orderId));
  const { toast } = useToast();
  
  useEffect(() => {
    // Refresh order data every 10 seconds
    const intervalId = setInterval(() => {
      const updatedOrder = getOrderById(orderId);
      setOrder(updatedOrder);
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [getOrderById, orderId]);
  
  if (!order) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-medium mb-2">Pedido não encontrado</h2>
        <p className="text-muted-foreground mb-6">
          Não conseguimos encontrar o pedido com o ID especificado.
        </p>
        <Button 
          onClick={onBackToShopping}
          className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
        >
          Voltar para as Compras
        </Button>
      </div>
    );
  }
  
  const getOrderIcon = () => {
    switch (order.status) {
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-500" />;
      case "confirmed":
        return <CircleCheck className="h-16 w-16 text-blue-500" />;
      case "preparing":
        return <ChefHat className="h-16 w-16 text-indigo-500" />;
      case "delivering":
        return <Truck className="h-16 w-16 text-purple-500" />;
      case "completed":
        return <CircleCheck className="h-16 w-16 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Clock className="h-16 w-16 text-yellow-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (order.status) {
      case "pending":
        return "Aguardando Confirmação";
      case "confirmed":
        return "Pedido Confirmado";
      case "preparing":
        return "Preparando Seu Pedido";
      case "delivering":
        return "Saiu para Entrega";
      case "completed":
        return "Pedido Entregue";
      case "cancelled":
        return "Pedido Cancelado";
      default:
        return "Processando Pedido";
    }
  };
  
  const getStatusDescription = () => {
    switch (order.status) {
      case "pending":
        return "Seu pedido foi recebido e está aguardando confirmação do restaurante.";
      case "confirmed":
        return "Seu pedido foi confirmado e logo entrará em preparo.";
      case "preparing":
        return "Estamos preparando seu pedido com todo cuidado.";
      case "delivering":
        return `Seu pedido está a caminho! Tempo estimado de entrega: ${order.location.estimatedTime}`;
      case "completed":
        return "Seu pedido foi entregue. Esperamos que tenha gostado!";
      case "cancelled":
        return "Lamentamos, mas seu pedido foi cancelado.";
      default:
        return "Estamos processando seu pedido.";
    }
  };
  
  const handlePaymentInstructions = () => {
    if (order.paymentMethod.id === "transfer") {
      toast({
        title: "Instruções de Pagamento",
        description: "Transfira o valor para: Banco XYZ, Conta: 1234-5, Nome: Cantinho, IBAN: AO..."
      });
    } else if (order.paymentMethod.id === "multicaixa") {
      toast({
        title: "Instruções de Pagamento",
        description: "Use o Multicaixa Express para pagar no número 9XX XXX XXX com referência: " + order.id
      });
    }
  };

  const stepStatuses = {
    pending: order.status !== "cancelled",
    confirmed: ["confirmed", "preparing", "delivering", "completed"].includes(order.status),
    preparing: ["preparing", "delivering", "completed"].includes(order.status),
    delivering: ["delivering", "completed"].includes(order.status),
    completed: order.status === "completed"
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mx-auto mb-6">
            {getOrderIcon()}
          </div>
          
          <h2 className="text-2xl font-bold mb-1">{getStatusText()}</h2>
          <p className="text-muted-foreground mb-4">
            {getStatusDescription()}
          </p>
          
          {order.status === "cancelled" ? (
            <div className="bg-red-50 border border-red-100 p-4 rounded-md mb-6">
              <p className="text-red-800">
                Se você tiver dúvidas sobre o cancelamento, entre em contato conosco.
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <div className="relative">
                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full mb-6">
                  <div 
                    className="h-2 bg-cantinho-terracotta rounded-full transition-all" 
                    style={{ 
                      width: order.status === "pending" ? "20%" :
                             order.status === "confirmed" ? "40%" :
                             order.status === "preparing" ? "60%" :
                             order.status === "delivering" ? "80%" :
                             order.status === "completed" ? "100%" : "0%" 
                    }}
                  />
                </div>
                
                {/* Steps */}
                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                  <div className={stepStatuses.pending ? "text-cantinho-terracotta" : "text-gray-500"}>
                    Recebido
                  </div>
                  <div className={stepStatuses.confirmed ? "text-cantinho-terracotta" : "text-gray-500"}>
                    Confirmado
                  </div>
                  <div className={stepStatuses.preparing ? "text-cantinho-terracotta" : "text-gray-500"}>
                    Em Preparo
                  </div>
                  <div className={stepStatuses.delivering ? "text-cantinho-terracotta" : "text-gray-500"}>
                    Em Entrega
                  </div>
                  <div className={stepStatuses.completed ? "text-cantinho-terracotta" : "text-gray-500"}>
                    Entregue
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Order Summary */}
          <div className="bg-muted/10 p-4 rounded-md mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Número do Pedido:</span>
              <span className="font-mono">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold">{formatPrice(order.total)}</span>
            </div>
          </div>
          
          {/* Payment Status */}
          {order.status !== "cancelled" && order.paymentStatus === "pending" && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
              <h3 className="font-medium mb-2">Pagamento Pendente</h3>
              <p className="text-sm text-yellow-800 mb-3">
                Para concluir seu pedido, finalize o pagamento através do método selecionado.
              </p>
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                {order.paymentMethod.name}
              </Badge>
              {(order.paymentMethod.id === "transfer" || order.paymentMethod.id === "multicaixa") && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={handlePaymentInstructions}
                >
                  Ver Instruções de Pagamento
                </Button>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              onClick={onBackToShopping}
              className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
            >
              Voltar às Compras
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
