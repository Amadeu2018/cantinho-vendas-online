
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Package, Clock, TrendingUp, Users } from "lucide-react";
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

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const uniqueCustomers = new Set(orders.map(order => {
    try {
      if (order.customerInfo?.name) return order.customerInfo.name;
      if (typeof order.customerInfo === 'string') {
        const parsed = JSON.parse(order.customerInfo);
        return parsed.name || 'cliente';
      }
      return 'cliente';
    } catch {
      return 'cliente';
    }
  })).size;

  const stats = [
    {
      title: "Pedidos Hoje",
      value: todaysOrders,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-blue-600",
      description: "+12% vs ontem",
      trend: "+12%"
    },
    {
      title: "Receita Total",
      value: totalRevenue,
      icon: DollarSign,
      gradient: "from-green-500 to-green-600",
      description: "+8% vs ontem",
      trend: "+8%",
      isCurrency: true
    },
    {
      title: "Concluídos",
      value: completedOrders,
      icon: Package,
      gradient: "from-purple-500 to-purple-600",
      description: `Taxa: ${orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%`,
      trend: `${orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%`
    },
    {
      title: "Pendentes",
      value: pendingOrders,
      icon: Clock,
      gradient: "from-orange-500 to-orange-600",
      description: "Aguardando",
      trend: "Aguardando"
    },
    {
      title: "Valor Médio",
      value: avgOrderValue,
      icon: TrendingUp,
      gradient: "from-teal-500 to-teal-600",
      description: "Por pedido",
      trend: "Por pedido",
      isCurrency: true
    },
    {
      title: "Clientes Únicos",
      value: uniqueCustomers,
      icon: Users,
      gradient: "from-indigo-500 to-indigo-600",
      description: "Este mês",
      trend: "Este mês"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className={`bg-gradient-to-br ${stat.gradient} text-white border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-white/80 text-xs sm:text-sm font-medium">
                  {stat.title}
                </p>
                <h3 className="text-2xl sm:text-3xl xl:text-4xl font-bold">
                  {stat.isCurrency ? (
                    new Intl.NumberFormat("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(stat.value)
                  ) : (
                    stat.value
                  )}
                </h3>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.description}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatsGrid;
