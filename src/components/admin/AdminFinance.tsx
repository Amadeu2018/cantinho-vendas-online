
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FinanceCharts from "./finance/FinanceCharts";
import { Order } from "@/hooks/admin/use-orders-data";

interface AdminFinanceProps {
  orders: Order[];
}

const AdminFinance = ({ orders }: AdminFinanceProps) => {
  const [period, setPeriod] = useState('month');

  const getFilteredOrders = () => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt); // Fixed: use createdAt instead of created_at
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
  };

  const filteredOrders = getFilteredOrders();
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const completedOrders = filteredOrders.filter(order => order.status === 'completed');
  const completedRevenue = completedOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const pendingRevenue = filteredOrders
    .filter(order => ['pending', 'confirmed', 'preparing', 'delivering'].includes(order.status))
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatórios Financeiros</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Semana</SelectItem>
            <SelectItem value="month">Mês</SelectItem>
            <SelectItem value="year">Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalRevenue.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Receita Confirmada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedRevenue.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Receita Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {pendingRevenue.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      <FinanceCharts 
        orders={filteredOrders}
        period={period}
        onPeriodChange={setPeriod}
      />
    </div>
  );
};

export default AdminFinance;
