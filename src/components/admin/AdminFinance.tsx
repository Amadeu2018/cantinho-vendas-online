
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Calendar, 
  Download,
  Search,
  Filter
} from "lucide-react";
import { Order } from "@/hooks/admin/use-orders-data";
import FinanceStats from "./finance/FinanceStats";
import FinanceCharts from "./finance/FinanceCharts";
import TransactionsTable from "./finance/TransactionsTable";

interface AdminFinanceProps {
  orders: Order[];
}

type Period = "day" | "week" | "month" | "year";

const AdminFinance = ({ orders }: AdminFinanceProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const financeData = useMemo(() => {
    const completedOrders = orders.filter(order => 
      order.paymentStatus === "completed" && order.status !== "cancelled"
    );
    
    const pendingOrders = orders.filter(order => 
      order.paymentStatus === "pending" && order.status !== "cancelled"
    );

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingRevenue = pendingOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    return {
      totalRevenue,
      pendingRevenue,
      completedOrders: completedOrders.length,
      totalOrders: orders.length,
      averageOrderValue,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, order) => 
        order.paymentStatus === "completed" ? sum + order.total : sum, 0
      )
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === "" || 
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || order.paymentStatus === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
  };

  const handleExportData = () => {
    // Implement export functionality
    console.log("Exporting finance data...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cantinho-navy">Finanças</h1>
          <p className="text-gray-600">Gerencie suas finanças e acompanhe o desempenho financeiro</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Dados
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <FinanceStats
        totalRevenue={financeData.totalRevenue}
        pendingRevenue={financeData.pendingRevenue}
        completedOrders={financeData.completedOrders}
        totalOrders={financeData.totalOrders}
        averageOrderValue={financeData.averageOrderValue}
      />

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos de Hoje</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financeData.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              pedidos registrados hoje
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita de Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-AO", {
                style: "currency",
                currency: "AOA",
                minimumFractionDigits: 0,
              }).format(financeData.todayRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              receita confirmada hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <FinanceCharts 
            orders={orders} 
            period={selectedPeriod} 
            onPeriodChange={handlePeriodChange}
          />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente ou ID do pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="completed">Pagos</option>
                <option value="pending">Pendentes</option>
                <option value="failed">Falhados</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>

          <TransactionsTable orders={filteredOrders} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Crescimento Mensal</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+12.5%</div>
                <p className="text-xs text-muted-foreground">vs mês anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {financeData.totalOrders > 0 ? 
                    Math.round((financeData.completedOrders / financeData.totalOrders) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">pedidos concluídos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                  }).format(financeData.averageOrderValue)}
                </div>
                <p className="text-xs text-muted-foreground">por pedido</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Pendente</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                    minimumFractionDigits: 0,
                  }).format(financeData.pendingRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">a receber</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFinance;
