
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Order } from "@/hooks/use-admin-orders";

interface DashboardChartsProps {
  orders: Order[];
}

const DashboardCharts = ({ orders }: DashboardChartsProps) => {
  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === "completed" ? sum + order.total : sum, 0);

  const salesData = [
    { name: 'Jan', vendas: 4000, pedidos: 24 },
    { name: 'Fev', vendas: 3000, pedidos: 18 },
    { name: 'Mar', vendas: 5000, pedidos: 32 },
    { name: 'Abr', vendas: 4500, pedidos: 28 },
    { name: 'Mai', vendas: 6000, pedidos: 35 },
    { name: 'Jun', vendas: Math.round(totalRevenue), pedidos: orders.length },
  ];

  const categoryData = [
    { name: 'Pratos Principais', value: 45, color: '#8B5CF6' },
    { name: 'Entradas', value: 25, color: '#06B6D4' },
    { name: 'Sobremesas', value: 20, color: '#F59E0B' },
    { name: 'Bebidas', value: 10, color: '#EF4444' },
  ];

  const COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
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
  );
};

export default DashboardCharts;
