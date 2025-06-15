
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Order } from "@/hooks/admin/use-orders-data";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";

interface DailyStats {
  date: string;
  revenue: number;
  orders: number;
}

interface StatusStats {
  name: string;
  value: number;
  color: string;
}

interface FinanceChartsProps {
  orders: Order[];
}

const FinanceCharts = ({ orders }: FinanceChartsProps) => {

  const dailyStats = useMemo(() => {
    const stats: { [key: string]: { revenue: number, orders: number } } = {};
    
    orders.forEach(order => {
      const date = format(parseISO(order.createdAt), 'yyyy-MM-dd');
      if (!stats[date]) {
        stats[date] = { revenue: 0, orders: 0 };
      }
      stats[date].revenue += order.total;
      stats[date].orders += 1;
    });

    return Object.keys(stats).sort().map(date => ({
      date: format(parseISO(date), 'dd/MM', { locale: ptBR }),
      revenue: stats[date].revenue,
      orders: stats[date].orders,
    }));
  }, [orders]);

  const statusData: StatusStats[] = useMemo(() => ([
    { name: 'Concluídos', value: orders.filter(o => o.status === 'completed').length, color: '#10B981' },
    { name: 'Pendentes', value: orders.filter(o => ['pending', 'confirmed', 'preparing', 'delivering'].includes(o.status)).length, color: '#F59E0B' },
    { name: 'Cancelados', value: orders.filter(o => o.status === 'cancelled').length, color: '#EF4444' }
  ]), [orders]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle>Receita por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Receita']} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Pedidos']} />
              <Bar dataKey="orders" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status dos Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceCharts;
