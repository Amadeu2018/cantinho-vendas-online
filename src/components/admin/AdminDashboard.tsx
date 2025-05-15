
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
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div className="p-6 bg-gradient-to-r from-cantinho-navy to-cantinho-navy/80 text-white flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Painel de Administração</h2>
        <AdminHeaderActions onLogout={onLogout} />
      </div>
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-white data-[state=active]:text-cantinho-navy data-[state=active]:shadow-sm"
            >
              Pedidos
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="data-[state=active]:bg-white data-[state=active]:text-cantinho-navy data-[state=active]:shadow-sm"
            >
              Produtos
            </TabsTrigger>
            <TabsTrigger 
              value="finance"
              className="data-[state=active]:bg-white data-[state=active]:text-cantinho-navy data-[state=active]:shadow-sm"
            >
              Finanças
            </TabsTrigger>
            <TabsTrigger 
              value="inventory"
              className="data-[state=active]:bg-white data-[state=active]:text-cantinho-navy data-[state=active]:shadow-sm"
            >
              Estoque
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="data-[state=active]:bg-white data-[state=active]:text-cantinho-navy data-[state=active]:shadow-sm"
            >
              Relatórios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="mt-2 focus:outline-none">
            <AdminOrdersList 
              orders={orders} 
              onSelectOrder={onSelectOrder}
              fetchingOrders={fetchingOrders}
            />
          </TabsContent>
          
          <TabsContent value="products" className="mt-2 focus:outline-none">
            <AdminProducts />
          </TabsContent>
          
          <TabsContent value="finance" className="mt-2 focus:outline-none">
            <AdminFinance orders={orders} />
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-2 focus:outline-none">
            <AdminInventory />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-2 focus:outline-none">
            <AdminReports orders={orders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
