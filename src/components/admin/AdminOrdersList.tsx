
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrders from "./AdminOrders";
import { Loader2 } from "lucide-react";

interface AdminOrdersListProps {
  orders: any[];
  onSelectOrder: (orderId: string) => void;
  fetchingOrders: boolean;
}

const AdminOrdersList = ({ orders, onSelectOrder, fetchingOrders }: AdminOrdersListProps) => {
  return (
    <div>
      {fetchingOrders ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Carregando pedidos...</p>
        </div>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="w-full overflow-x-auto flex">
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
            <TabsTrigger value="preparing">Em Preparo</TabsTrigger>
            <TabsTrigger value="delivering">Em Entrega</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <AdminOrders 
              orders={orders.filter(order => order.status === "pending")} 
              onSelectOrder={onSelectOrder}
            />
          </TabsContent>
          
          <TabsContent value="confirmed">
            <AdminOrders 
              orders={orders.filter(order => order.status === "confirmed")} 
              onSelectOrder={onSelectOrder}
            />
          </TabsContent>
          
          <TabsContent value="preparing">
            <AdminOrders 
              orders={orders.filter(order => order.status === "preparing")} 
              onSelectOrder={onSelectOrder}
            />
          </TabsContent>
          
          <TabsContent value="delivering">
            <AdminOrders 
              orders={orders.filter(order => order.status === "delivering")} 
              onSelectOrder={onSelectOrder}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <AdminOrders 
              orders={orders.filter(order => order.status === "completed")} 
              onSelectOrder={onSelectOrder}
            />
          </TabsContent>
          
          <TabsContent value="cancelled">
            <AdminOrders 
              orders={orders.filter(order => order.status === "cancelled")} 
              onSelectOrder={onSelectOrder}
            />
          </TabsContent>
          
          <TabsContent value="all">
            <AdminOrders 
              orders={orders} 
              onSelectOrder={onSelectOrder}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminOrdersList;
