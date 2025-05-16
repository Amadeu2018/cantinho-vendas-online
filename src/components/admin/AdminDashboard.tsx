
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrdersList from "@/components/admin/AdminOrdersList";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminFinance from "@/components/admin/AdminFinance";
import AdminInventory from "@/components/admin/AdminInventory";
import AdminReports from "@/components/admin/AdminReports";
import { Order as CartOrder } from "@/contexts/CartContext";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Wallet, CalendarDays, Users, ArrowUp, ArrowDown, Plus, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Calculate summary statistics
  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === "completed" ? sum + order.total : sum, 0);
  
  const completedOrders = orders.filter(order => order.status === "completed").length;
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
          <Button className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] hover:opacity-90 flex items-center">
            <CalendarPlus className="mr-2 h-4 w-4" onClick={() => navigate('/admin/eventos')} /> Agendar Evento
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pedidos Hoje</p>
              <h3 className="text-2xl font-bold text-gray-800">{todaysOrders}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-semibold flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> 12%
            </span>
            <span className="text-gray-500 text-sm"> vs ontem</span>
          </div>
        </Card>
        
        <Card className="p-6 transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Receita Total</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {new Intl.NumberFormat("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                  minimumFractionDigits: 0,
                }).format(totalRevenue)}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-semibold flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> 8%
            </span>
            <span className="text-gray-500 text-sm"> vs ontem</span>
          </div>
        </Card>
        
        <Card className="p-6 transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Eventos Agendados</p>
              <h3 className="text-2xl font-bold text-gray-800">3</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <CalendarDays className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-500 text-sm font-semibold flex items-center">
              <ArrowDown className="h-3 w-3 mr-1" /> 1
            </span>
            <span className="text-gray-500 text-sm"> vs ontem</span>
          </div>
        </Card>
        
        <Card className="p-6 transition-all hover:shadow-md hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Clientes Novos</p>
              <h3 className="text-2xl font-bold text-gray-800">5</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-semibold flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> 2
            </span>
            <span className="text-gray-500 text-sm"> vs ontem</span>
          </div>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Pedidos Recentes</h2>
          <Button variant="link" className="text-sm text-[#4f46e5]">
            Ver todos
          </Button>
        </div>
        <div className="divide-y divide-gray-200">
          {orders.slice(0, 4).map((order) => (
            <div 
              key={order.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onSelectOrder(order.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">#{order.id.slice(0, 10)}</p>
                  <p className="text-sm text-gray-500">{order.customerInfo.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    {new Intl.NumberFormat("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                      minimumFractionDigits: 0,
                    }).format(order.total)}
                  </p>
                  <p className="text-sm text-gray-500">{order.type || "Pedido"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className={
                  order.paymentStatus === "completed" 
                    ? "bg-green-50 text-green-800 border-green-200" 
                    : "bg-yellow-50 text-yellow-800 border-yellow-200"
                }>
                  {order.paymentStatus === "completed" ? "Pago" : "Pendente"}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(order.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Main admin tabs */}
      <Card className="overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="bg-transparent h-14 w-full justify-start rounded-none pl-4 pt-2">
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#4f46e5] data-[state=active]:text-[#4f46e5] rounded-none bg-transparent h-12"
              >
                Pedidos
              </TabsTrigger>
              <TabsTrigger 
                value="products"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#4f46e5] data-[state=active]:text-[#4f46e5] rounded-none bg-transparent h-12"
              >
                Produtos
              </TabsTrigger>
              <TabsTrigger 
                value="finance"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#4f46e5] data-[state=active]:text-[#4f46e5] rounded-none bg-transparent h-12"
              >
                Finanças
              </TabsTrigger>
              <TabsTrigger 
                value="inventory"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#4f46e5] data-[state=active]:text-[#4f46e5] rounded-none bg-transparent h-12"
              >
                Estoque
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#4f46e5] data-[state=active]:text-[#4f46e5] rounded-none bg-transparent h-12"
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
              <AdminReports orders={orders} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminDashboard;
