
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminFinance from "@/components/admin/AdminFinance";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminReports from "@/components/admin/AdminReports";
import AdminHeaderActions from "@/components/admin/AdminHeaderActions";
import { Order as CartOrder } from "@/contexts/CartContext";

interface AdminDashboardProps {
  orders: CartOrder[];
  fetchingOrders: boolean;
  onSelectOrder: (orderId: string) => void;
  onPrepareInvoice: (order: CartOrder) => void;
  onLogout: () => void;
}

const AdminDashboard = ({ 
  orders, 
  fetchingOrders, 
  onSelectOrder, 
  onPrepareInvoice,
  onLogout 
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-cantinho-navy text-white flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-xl font-semibold">Painel de Administração</h2>
        <AdminHeaderActions onLogout={onLogout} />
      </div>
      
      <div className="p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="finance">Finanças</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders">
            <AdminOrdersList 
              orders={orders} 
              onSelectOrder={onSelectOrder}
              fetchingOrders={fetchingOrders}
            />
          </TabsContent>
          
          <TabsContent value="products">
            <AdminProducts />
          </TabsContent>
          
          <TabsContent value="finance">
            <AdminFinance orders={orders} />
          </TabsContent>
          
          <TabsContent value="inventory">
            <AdminInventory />
          </TabsContent>
          
          <TabsContent value="reports">
            <AdminReports orders={orders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
