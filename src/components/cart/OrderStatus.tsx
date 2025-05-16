
import React, { useState, useEffect } from "react";
import { useCart, Order } from "@/contexts/CartContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, Clock, Loader2 } from "lucide-react";

interface OrderStatusProps {
  orderId: string;
  onBackToShopping: () => void;
}

const OrderStatus = ({ orderId, onBackToShopping }: OrderStatusProps) => {
  const { getOrderById } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-16 w-16 text-cantinho-navy animate-spin mb-4" />
        <p className="text-lg font-medium text-cantinho-navy">Carregando informações do pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-medium mb-4">Pedido não encontrado</p>
        <Button onClick={onBackToShopping} className="bg-cantinho-navy hover:bg-cantinho-navy/90">
          Voltar ao Menu
        </Button>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (order.status) {
      case "pending":
        return {
          title: "Pedido Recebido",
          description: "Estamos processando seu pedido. Aguarde a confirmação.",
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          color: "text-yellow-600",
        };
      case "confirmed":
        return {
          title: "Pedido Confirmado",
          description: "Seu pedido foi confirmado e está sendo preparado.",
          icon: <CheckCircle className="h-16 w-16 text-blue-500" />,
          color: "text-blue-600",
        };
      case "preparing":
        return {
          title: "Em Preparo",
          description: "Nossos cozinheiros estão preparando seu pedido com carinho.",
          icon: <Loader2 className="h-16 w-16 text-indigo-500 animate-spin" />,
          color: "text-indigo-600",
        };
      case "delivering":
        return {
          title: "Em Entrega",
          description: `Seu pedido está a caminho! Tempo estimado de entrega: ${order.location.estimatedTime}.`,
          icon: <Loader2 className="h-16 w-16 text-purple-500 animate-spin" />,
          color: "text-purple-600",
        };
      case "completed":
        return {
          title: "Pedido Entregue",
          description: "Seu pedido foi entregue com sucesso. Bom apetite!",
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          color: "text-green-600",
        };
      case "cancelled":
        return {
          title: "Pedido Cancelado",
          description: "Seu pedido foi cancelado.",
          icon: <Clock className="h-16 w-16 text-red-500" />,
          color: "text-red-600",
        };
      default:
        return {
          title: "Status Desconhecido",
          description: "Não foi possível determinar o status do seu pedido.",
          icon: <Clock className="h-16 w-16 text-gray-500" />,
          color: "text-gray-600",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Pedido #{orderId.substring(0, 8)}</CardTitle>
            <span className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString('pt-BR')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">{statusInfo.icon}</div>
            <h2 className={`text-2xl font-bold ${statusInfo.color} mb-2`}>{statusInfo.title}</h2>
            <p className="text-gray-600">{statusInfo.description}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 border-b pb-2">Resumo do Pedido</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Entrega</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 border-b pb-2">Detalhes da Entrega</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Nome:</span> {order.customerInfo.name}
                </p>
                <p>
                  <span className="font-medium">Endereço:</span> {order.customerInfo.address}
                </p>
                <p>
                  <span className="font-medium">Telefone:</span> {order.customerInfo.phone}
                </p>
                <p>
                  <span className="font-medium">Localização:</span> {order.location.name}
                </p>
                <p>
                  <span className="font-medium">Método de Pagamento:</span> {order.paymentMethod.name}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-6">
          <Button onClick={onBackToShopping} className="bg-cantinho-navy hover:bg-cantinho-navy/90 w-full">
            Voltar ao Menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderStatus;
