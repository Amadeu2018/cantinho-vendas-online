
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface FinanceChartsProps {
  orders: any[];
  period: string;
  onPeriodChange: (period: string) => void;
}

const FinanceCharts = ({ orders, period, onPeriodChange }: FinanceChartsProps) => {
  const getFilteredOrders = () => {
    const now = new Date();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      switch (period) {
        case 'week':
          return orderDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return orderDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'year':
          return orderDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    });
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const revenueData = filteredOrders.reduce((acc: any[], order) => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.revenue += Number(order.total) || 0;
    } else {
      acc.push({ date, revenue: Number(order.total) || 0 });
    }
    return acc;
  }, []).slice(-7);

  const statusData = [
    { name: 'Concluídos', value: filteredOrders.filter(o => o.status === 'completed').length, color: '#10B981' },
    { name: 'Pendentes', value: filteredOrders.filter(o => o.status === 'pending').length, color: '#F59E0B' },
    { name: 'Cancelados', value: filteredOrders.filter(o => o.status === 'cancelled').length, color: '#EF4444' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Receita por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}`, 'Receita']} />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
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
