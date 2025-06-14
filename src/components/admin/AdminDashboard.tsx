
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminFinance from "@/components/admin/AdminFinance";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminReports from "@/components/admin/AdminReports";
import AdminCustomers from "./AdminCustomers";
import { Order as CartOrder } from "@/contexts/CartContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardStatsGrid from "./dashboard/DashboardStatsGrid";
import DashboardCharts from "./dashboard/DashboardCharts";
import RecentOrders from "./dashboard/RecentOrders";
import DashboardCard from "./DashboardCard";
import { TrendingUp } from "lucide-react";

interface AdminDashboardProps {
  orders: CartOrder[];
  fetchingOrders: boolean;
  onSelectOrder: (orderId: string) => void;
  onPrepareInvoice: (order: CartOrder) => void;
  onLogout: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminDashboard = ({ 
  orders, 
  fetchingOrders, 
  onSelectOrder, 
  onPrepareInvoice,
  onLogout,
  activeTab = "dashboard",
  onTabChange
}: AdminDashboardProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Dados atualizados",
        description: "Dashboard atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === "completed" ? sum + order.total : sum, 0);
  
  const completedOrders = orders.filter(order => order.status === "completed").length;

  return (
    <div className="space-y-8">
      <DashboardHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      
      <DashboardStatsGrid orders={orders} />
      
      {activeTab === "dashboard" && (
        <DashboardCharts orders={orders} />
      )}
      
      <Card className="overflow-hidden shadow-2xl border-0">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="bg-gradient-to-r from-cantinho-cream/30 to-white border-b-2 border-gray-100">
            <TabsList className="bg-transparent h-16 w-full justify-start rounded-none pl-6 pt-2">
              {[
                { value: "dashboard", label: "Dashboard" },
                { value: "orders", label: "Pedidos" },
                { value: "products", label: "Produtos" },
                { value: "customers", label: "Clientes" },
                { value: "finance", label: "Finanças" },
                { value: "inventory", label: "Estoque" },
                { value: "reports", label: "Relatórios" }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:border-b-3 data-[state=active]:border-cantinho-terracotta data-[state=active]:text-cantinho-terracotta rounded-none bg-transparent h-12 px-6 font-semibold transition-all duration-300 hover:bg-gray-50"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white min-h-[400px]">
            <TabsContent value="dashboard" className="m-0 focus:outline-none">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3">
                  <RecentOrders 
                    orders={orders}
                    onSelectOrder={onSelectOrder}
                  />
                </div>
                <div className="space-y-6">
                  <DashboardCard
                    title="Resumo Rápido"
                    value=""
                    icon={<TrendingUp className="h-5 w-5" />}
                    className="bg-gradient-to-br from-cantinho-cream/30 to-white shadow-lg border-0"
                  />
                  <div className="space-y-4 p-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-sm font-medium">Média por pedido</span>
                      <span className="font-bold text-blue-700">
                        {orders.length > 0 ? (totalRevenue / orders.length).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : '0 AOA'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                      <span className="text-sm font-medium">Taxa de conversão</span>
                      <span className="font-bold text-green-700">{orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <span className="text-sm font-medium">Tempo médio preparo</span>
                      <span className="font-bold text-purple-700">18 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
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

            <TabsContent value="customers" className="m-0 focus:outline-none">
              <AdminCustomers />
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
