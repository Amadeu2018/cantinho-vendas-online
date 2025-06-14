
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Package, Clock, TrendingUp } from "lucide-react";
import { Order } from "@/hooks/use-admin-orders";

interface DashboardStatsGridProps {
  orders: Order[];
}

const DashboardStatsGrid = ({ orders }: DashboardStatsGridProps) => {
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
              <p className="text-xs text-purple-200 mt-1">Taxa: {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%</p>
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
  );
};

export default DashboardStatsGrid;
