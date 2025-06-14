
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
import { Plus, CalendarPlus, TrendingUp, Users, Package, DollarSign, ShoppingCart, Clock, Star } from "lucide-react";
import DashboardStats from "./dashboard/DashboardStats";
import RecentOrders from "./dashboard/RecentOrders";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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

  // Sample data for charts
  const salesData = [
    { name: 'Jan', vendas: 4000, pedidos: 24 },
    { name: 'Fev', vendas: 3000, pedidos: 18 },
    { name: 'Mar', vendas: 5000, pedidos: 32 },
    { name: 'Abr', vendas: 4500, pedidos: 28 },
    { name: 'Mai', vendas: 6000, pedidos: 35 },
    { name: 'Jun', vendas: 5500, pedidos: 30 },
  ];

  const categoryData = [
    { name: 'Pratos Principais', value: 45, color: '#8B5CF6' },
    { name: 'Entradas', value: 25, color: '#06B6D4' },
    { name: 'Sobremesas', value: 20, color: '#F59E0B' },
    { name: 'Bebidas', value: 10, color: '#EF4444' },
  ];

  const COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-cantinho-navy via-cantinho-terracotta to-cantinho-navy rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-4xl font-bold mb-3">Bem-vindo ao Dashboard! 🚀</h2>
              <p className="text-white/90 text-lg mb-4">Gerencie seu negócio com eficiência e estilo</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Crescimento constante</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Clientes satisfeitos</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">5 estrelas</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
      </div>
      
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Pedidos Hoje</p>
                <h3 className="text-4xl font-bold">{todaysOrders}</h3>
                <p className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% vs ontem
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShoppingCart className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Receita Total</p>
                <h3 className="text-4xl font-bold">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(totalRevenue)}
                </h3>
                <p className="text-xs text-green-200 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% vs ontem
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Concluídos</p>
                <h3 className="text-4xl font-bold">{completedOrders}</h3>
                <p className="text-xs text-purple-200 mt-1">Taxa: 94%</p>
              </div>
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Package className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pendentes</p>
                <h3 className="text-4xl font-bold">{pendingOrders}</h3>
                <p className="text-xs text-orange-200 mt-1">Aguardando</p>
              </div>
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Clock className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <Card className="xl:col-span-2 shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle className="text-cantinho-navy">Vendas Mensais</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'vendas' ? `${value} AOA` : value,
                    name === 'vendas' ? 'Vendas' : 'Pedidos'
                  ]} />
                  <Bar dataKey="vendas" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pedidos" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle className="text-cantinho-navy">Categorias Mais Vendidas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                    <span className="font-semibold">{category.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Main admin tabs */}
      <Card className="overflow-hidden shadow-2xl border-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-gradient-to-r from-cantinho-cream/30 to-white border-b-2 border-gray-100">
            <TabsList className="bg-transparent h-16 w-full justify-start rounded-none pl-6 pt-2">
              {[
                { value: "dashboard", label: "Dashboard" },
                { value: "orders", label: "Pedidos" },
                { value: "products", label: "Produtos" },
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
                  <Card className="bg-gradient-to-br from-cantinho-cream/30 to-white shadow-lg border-0">
                    <CardHeader>
                      <CardTitle className="text-cantinho-navy flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Resumo Rápido
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <span className="text-sm font-medium">Média por pedido</span>
                        <span className="font-bold text-blue-700">
                          {orders.length > 0 ? (totalRevenue / orders.length).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : '0 AOA'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                        <span className="text-sm font-medium">Taxa de conversão</span>
                        <span className="font-bold text-green-700">94%</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <span className="text-sm font-medium">Tempo médio preparo</span>
                        <span className="font-bold text-purple-700">18 min</span>
                      </div>
                    </CardContent>
                  </Card>
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
