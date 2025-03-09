
import { useState, useMemo } from "react";
import { Order } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { CalendarIcon, TrendingUpIcon, CircleDollarSignIcon, ActivityIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type AdminFinanceProps = {
  orders: Order[];
};

const COLORS = ["#3D405B", "#E07A5F", "#81B29A", "#F2CC8F"];

const AdminFinance = ({ orders }: AdminFinanceProps) => {
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month");
  
  const totalRevenue = useMemo(() => {
    return orders
      .filter(order => order.status !== "cancelled" && order.paymentStatus === "completed")
      .reduce((total, order) => total + order.total, 0);
  }, [orders]);
  
  const pendingRevenue = useMemo(() => {
    return orders
      .filter(order => 
        order.status !== "cancelled" && 
        order.paymentStatus === "pending" && 
        order.status !== "completed"
      )
      .reduce((total, order) => total + order.total, 0);
  }, [orders]);
  
  const completedOrders = useMemo(() => {
    return orders.filter(order => order.status === "completed").length;
  }, [orders]);
  
  const totalOrders = useMemo(() => {
    return orders.filter(order => order.status !== "cancelled").length;
  }, [orders]);
  
  const averageOrderValue = useMemo(() => {
    if (totalOrders === 0) return 0;
    return totalRevenue / totalOrders;
  }, [totalRevenue, totalOrders]);
  
  // Generate revenue data by payment method
  const paymentMethodData = useMemo(() => {
    const data: Record<string, number> = {};
    
    orders
      .filter(order => order.status !== "cancelled" && order.paymentStatus === "completed")
      .forEach(order => {
        const methodName = order.paymentMethod.name;
        if (!data[methodName]) {
          data[methodName] = 0;
        }
        data[methodName] += order.total;
      });
    
    return Object.entries(data).map(([name, value]) => ({
      name,
      value
    }));
  }, [orders]);
  
  // Generate revenue data by day/week/month
  const revenueData = useMemo(() => {
    const data: Record<string, number> = {};
    const now = new Date();
    
    orders
      .filter(order => order.status !== "cancelled" && order.paymentStatus === "completed")
      .forEach(order => {
        const date = new Date(order.createdAt);
        let key = "";
        
        if (period === "day") {
          key = format(date, "HH:00");
        } else if (period === "week") {
          key = format(date, "EEE");
        } else if (period === "month") {
          key = format(date, "dd/MM");
        } else if (period === "year") {
          key = format(date, "MMM");
        }
        
        if (!data[key]) {
          data[key] = 0;
        }
        data[key] += order.total;
      });
    
    return Object.entries(data).map(([name, value]) => ({
      name,
      value
    }));
  }, [orders, period]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CircleDollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(pendingRevenue)} pendente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Completos</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              de {totalOrders} pedidos totais
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              por pedido
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              de pedidos concluídos
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Receita por Método de Pagamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Receita por Período</CardTitle>
              <TabsList>
                <TabsTrigger value="day" onClick={() => setPeriod("day")}>Dia</TabsTrigger>
                <TabsTrigger value="week" onClick={() => setPeriod("week")}>Semana</TabsTrigger>
                <TabsTrigger value="month" onClick={() => setPeriod("month")} className="active">Mês</TabsTrigger>
                <TabsTrigger value="year" onClick={() => setPeriod("year")}>Ano</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="value" fill="#3D405B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders
                .filter(order => order.status !== "cancelled")
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.slice(4, 12)}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), "dd/MM/yy HH:mm")}</TableCell>
                    <TableCell>{order.customerInfo.name}</TableCell>
                    <TableCell>{order.paymentMethod.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentStatus === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.paymentStatus === "completed" ? "Pago" : "Pendente"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinance;
