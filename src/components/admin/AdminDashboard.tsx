
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminFinance from "@/components/admin/AdminFinance";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminReports from "@/components/admin/AdminReports";
import { Order as CartOrder } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CalendarPlus, TrendingUp, Users, Package, DollarSign } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("dashboard");

  // Calculate summary statistics
  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === "completed" ? sum + order.total : sum, 0);
  
  const todaysOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return today === orderDate;
  }).length;

  const completedOrders = orders.filter(order => order.status === "completed").length;
  const pendingOrders = orders.filter(order => order.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bem-vindo ao Dashboard!</h2>
            <p className="text-white/90 text-lg">Gerencie seu negócio com eficiência e estilo</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Crescimento constante</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">Clientes satisfeitos</span>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="secondary" 
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Pedido
            </Button>
            <Button 
              variant="secondary"
              className="bg-white text-cantinho-navy hover:bg-white/90 transition-all duration-300 shadow-lg"
            >
              <CalendarPlus className="mr-2 h-4 w-4" /> Agendar Evento
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Pedidos Hoje</p>
                <h3 className="text-3xl font-bold text-blue-800">{todaysOrders}</h3>
                <p className="text-xs text-blue-600 mt-1">+12% vs ontem</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Receita Total</p>
                <h3 className="text-3xl font-bold text-green-800">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                  }).format(totalRevenue)}
                </h3>
                <p className="text-xs text-green-600 mt-1">+8% vs ontem</p>
              </div>
              <div className="p-3 bg-green-500 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Pedidos Concluídos</p>
                <h3 className="text-3xl font-bold text-purple-800">{completedOrders}</h3>
                <p className="text-xs text-purple-600 mt-1">Taxa de conclusão: 94%</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Pedidos Pendentes</p>
                <h3 className="text-3xl font-bold text-orange-800">{pendingOrders}</h3>
                <p className="text-xs text-orange-600 mt-1">Aguardando confirmação</p>
              </div>
              <div className="p-3 bg-orange-500 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Overview */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RecentOrders 
              orders={orders}
              onSelectOrder={onSelectOrder}
            />
          </div>
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-cantinho-cream to-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-cantinho-navy">Resumo Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Média por pedido</span>
                  <span className="font-bold text-blue-700">
                    {orders.length > 0 ? (totalRevenue / orders.length).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : '0 AOA'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Taxa de conversão</span>
                  <span className="font-bold text-green-700">94%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Tempo médio preparo</span>
                  <span className="font-bold text-purple-700">18 min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Main admin tabs */}
      <Card className="overflow-hidden shadow-xl border-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-gradient-to-r from-cantinho-cream/50 to-white border-b">
            <TabsList className="bg-transparent h-16 w-full justify-start rounded-none pl-6 pt-2">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-terracotta data-[state=active]:text-cantinho-terracotta rounded-none bg-transparent h-12 px-6 font-medium transition-all duration-300"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-terracotta data-[state=active]:text-cantinho-terracotta rounded-none bg-transparent h-12 px-6 font-medium transition-all duration-300"
              >
                Pedidos
              </TabsTrigger>
              <TabsTrigger 
                value="products"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-terracotta data-[state=active]:text-cantinho-terracotta rounded-none bg-transparent h-12 px-6 font-medium transition-all duration-300"
              >
                Produtos
              </TabsTrigger>
              <TabsTrigger 
                value="finance"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-terracotta data-[state=active]:text-cantinho-terracotta rounded-none bg-transparent h-12 px-6 font-medium transition-all duration-300"
              >
                Finanças
              </TabsTrigger>
              <TabsTrigger 
                value="inventory"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-terracotta data-[state=active]:text-cantinho-terracotta rounded-none bg-transparent h-12 px-6 font-medium transition-all duration-300"
              >
                Estoque
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="data-[state=active]:border-b-2 data-[state=active]:border-cantinho-terracotta data-[state=active]:text-cantinho-terracotta rounded-none bg-transparent h-12 px-6 font-medium transition-all duration-300"
              >
                Relatórios
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-8">
            <TabsContent value="dashboard" className="m-0 focus:outline-none">
              <div className="text-center py-8">
                <h3 className="text-2xl font-semibold text-cantinho-navy mb-4">Dashboard Principal</h3>
                <p className="text-gray-600">Visão geral das estatísticas e pedidos recentes exibida acima.</p>
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
