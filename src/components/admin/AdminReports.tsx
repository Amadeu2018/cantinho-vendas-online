
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Order } from "@/hooks/admin/use-orders-data";
import { format, parseISO, subMonths, isAfter, startOfMonth, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Package, DollarSign, CheckCircle, TrendingUp } from "lucide-react";

interface AdminReportsProps {
  orders: Order[];
}

const AdminReports = ({ orders }: AdminReportsProps) => {
  const { totalOrders, totalRevenue, completedOrders, avgOrderValue } = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = orders.filter(order => order.status === "completed").length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalOrders, totalRevenue, completedOrders, avgOrderValue };
  }, [orders]);

  const monthlyData = useMemo(() => {
    const monthlySummary: { [key: string]: { pedidos: number; receita: number } } = {};
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

    for (let i = 0; i < 6; i++) {
      const month = format(subMonths(new Date(), i), 'yyyy-MM');
      monthlySummary[month] = { pedidos: 0, receita: 0 };
    }

    orders.forEach(order => {
      const orderDate = parseISO(order.createdAt);
      if (isAfter(orderDate, sixMonthsAgo)) {
        const monthKey = format(orderDate, 'yyyy-MM');
        if (monthlySummary[monthKey]) {
          monthlySummary[monthKey].pedidos += 1;
          monthlySummary[monthKey].receita += order.total;
        }
      }
    });
    
    return Object.keys(monthlySummary)
      .sort()
      .map(monthKey => ({
        month: format(parseISO(monthKey + '-02'), 'MMM/yy', { locale: ptBR }),
        pedidos: monthlySummary[monthKey].pedidos,
        receita: monthlySummary[monthKey].receita
      }));
  }, [orders]);

  const dailyData = useMemo(() => {
    const dailySummary: { [key: string]: { pedidos: number; receita: number } } = {};
    
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayKey = format(day, 'yyyy-MM-dd');
      dailySummary[dayKey] = { pedidos: 0, receita: 0 };
    }

    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));

    orders.forEach(order => {
      const orderDate = parseISO(order.createdAt);
      if (isAfter(orderDate, sevenDaysAgo)) {
        const dayKey = format(orderDate, 'yyyy-MM-dd');
        if (dailySummary[dayKey]) {
          dailySummary[dayKey].pedidos += 1;
          dailySummary[dayKey].receita += order.total;
        }
      }
    });

    return Object.keys(dailySummary)
      .sort()
      .map(dayKey => ({
        day: format(parseISO(dayKey), 'EEE', { locale: ptBR }),
        pedidos: dailySummary[dayKey].pedidos,
        receita: dailySummary[dayKey].receita,
      }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const productSales: { [name: string]: { vendas: number } } = {};

    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!productSales[item.name]) {
            productSales[item.name] = { vendas: 0 };
          }
          productSales[item.name].vendas += item.quantity;
        });
      }
    });

    return Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.vendas - a.vendas)
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Todos os períodos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
            </div>
            <p className="text-xs text-muted-foreground">Todos os períodos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Taxa: {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}% de conclusão
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgOrderValue.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
            </div>
            <p className="text-xs text-muted-foreground">Por pedido</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Últimos 6 Meses</TabsTrigger>
          <TabsTrigger value="daily">Últimos 7 Dias</TabsTrigger>
          <TabsTrigger value="products">Top Produtos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pedidos" fill="var(--color-primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [value.toLocaleString("pt-AO", { style: "currency", currency: "AOA" }), 'Receita']} />
                    <Line type="monotone" dataKey="receita" stroke="var(--color-primary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Diários</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value: number, name) => [name === 'pedidos' ? value : value.toLocaleString("pt-AO", { style: "currency", currency: "AOA" }), name === 'pedidos' ? 'Pedidos' : 'Receita']} />
                  <Bar dataKey="pedidos" fill="var(--color-secondary)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Vendas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.length > 0 ? (
                    topProducts.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.vendas}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        Sem dados de vendas para exibir.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
