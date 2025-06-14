
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrdersHistoryProps {
  orders: any[];
}

const OrdersHistory = ({ orders }: OrdersHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Intl.NumberFormat("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      }).format(order.total)}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Você ainda não fez nenhum pedido</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersHistory;
