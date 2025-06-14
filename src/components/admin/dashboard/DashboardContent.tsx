
import React from "react";
import { Order } from "@/hooks/admin/use-orders-data";
import DashboardCard from "../DashboardCard";
import RecentOrders from "./RecentOrders";
import { TrendingUp } from "lucide-react";

interface DashboardContentProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
}

const DashboardContent = ({ orders, onSelectOrder }: DashboardContentProps) => {
  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === "completed" ? sum + order.total : sum, 0);
  
  const completedOrders = orders.filter(order => order.status === "completed").length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <div className="xl:col-span-3">
        <RecentOrders 
          orders={orders}
          onSelectOrder={onSelectOrder}
        />
      </div>
      <div className="space-y-6">
        <DashboardCard
          title="Resumo Rápido"
          value=""
          icon={<TrendingUp className="h-5 w-5" />}
          className="bg-gradient-to-br from-cantinho-cream/30 to-white shadow-lg border-0"
        />
        <div className="space-y-4 p-4">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-sm font-medium">Média por pedido</span>
            <span className="font-bold text-blue-700">
              {orders.length > 0 ? (totalRevenue / orders.length).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : '0 AOA'}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
            <span className="text-sm font-medium">Taxa de conversão</span>
            <span className="font-bold text-green-700">{orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
            <span className="text-sm font-medium">Tempo médio preparo</span>
            <span className="font-bold text-purple-700">18 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
