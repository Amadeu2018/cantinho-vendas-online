
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminFinance from "@/components/admin/AdminFinance";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminReports from "@/components/admin/AdminReports";
import { Order as CartOrder } from "@/contexts/CartContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CalendarPlus } from "lucide-react";
import DashboardStats from "./dashboard/DashboardStats";
import RecentOrders from "./dashboard/RecentOrders";

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

  // Calculate summary statistics
  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === "completed" ? sum + order.total : sum, 0);
  
  const todaysOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return today === orderDate;
  }).length;

  return (
    <div className="space-y-6">
      {/* Welcome and Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bem-vindo, Admin!</h2>
          <p className="text-gray-600">Aqui está o resumo das suas atividades hoje</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Novo Pedido
          </Button>
          <Button className="bg-gradient-to-br from-cantinho-navy to-cantinho-navy/90 flex items-center">
            <CalendarPlus className="mr-2 h-4 w-4" /> Agendar Evento
          </Button>
        </div>
      </div>
      
      <DashboardStats 
        todaysOrders={todaysOrders}
        totalRevenue={totalRevenue}
      />
      
      <RecentOrders 
        orders={orders}
        onSelectOrder={onSelectOrder}
      />
      
      {/* Main admin tabs */}
      <Card className="overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="bg-transparent h-14 w-full justify-start rounded-none pl-4 pt-2">
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-navy data-[state=active]:text-cantinho-navy rounded-none bg-transparent h-12"
              >
                Pedidos
              </TabsTrigger>
              <TabsTrigger 
                value="products"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-navy data-[state=active]:text-cantinho-navy rounded-none bg-transparent h-12"
              >
                Produtos
              </TabsTrigger>
              <TabsTrigger 
                value="finance"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-navy data-[state=active]:text-cantinho-navy rounded-none bg-transparent h-12"
              >
                Finanças
              </TabsTrigger>
              <TabsTrigger 
                value="inventory"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-navy data-[state=active]:text-cantinho-navy rounded-none bg-transparent h-12"
              >
                Estoque
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-navy data-[state=active]:text-cantinho-navy rounded-none bg-transparent h-12"
              >
                Relatórios
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="orders" className="m-0 focus:outline-none">
              <AdminOrdersList 
                orders={orders} 
                onSelectOrder={onSelectOrder}
                fetchingOrders={fetchingOrders}
              />
            </TabsContent>
            
            <TabsContent value="products" className="m-0 focus:outline-none">
              <AdminProducts />
            </TabsContent>
            
            <TabsContent value="finance" className="m-0 focus:outline-none">
              <AdminFinance orders={orders} />
            </TabsContent>
            
            <TabsContent value="inventory" className="m-0 focus:outline-none">
              <AdminInventory />
            </TabsContent>
            
            <TabsContent value="reports" className="m-0 focus:outline-none">
              <AdminReports />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminDashboard;
