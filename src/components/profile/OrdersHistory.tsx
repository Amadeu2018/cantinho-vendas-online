
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, CreditCard } from "lucide-react";

interface OrdersHistoryProps {
  orders: any[];
}

const OrdersHistory = ({ orders }: OrdersHistoryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      case 'confirmed':
        return 'Confirmado';
      case 'preparing':
        return 'Preparando';
      case 'delivering':
        return 'Entregando';
      default:
        return status;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Package className="h-5 w-5 text-cantinho-terracotta" />
          Histórico de Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <Badge className={`w-fit text-xs ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{order.items.length}</span> 
                        {order.items.length === 1 ? ' item' : ' itens'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <CreditCard className="h-4 w-4 text-cantinho-terracotta" />
                      <span className="font-bold text-lg text-cantinho-terracotta">
                        {new Intl.NumberFormat("pt-AO", {
                          style: "currency",
                          currency: "AOA",
                          minimumFractionDigits: 0,
                        }).format(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order items preview on mobile */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 sm:hidden">
                    <div className="text-xs text-gray-500 space-y-1">
                      {order.items.slice(0, 2).map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>{item.quantity}x</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-gray-400">
                          +{order.items.length - 2} mais itens
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-600 font-medium">Nenhum pedido encontrado</p>
              <p className="text-sm text-gray-500">Você ainda não fez nenhum pedido</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersHistory;
