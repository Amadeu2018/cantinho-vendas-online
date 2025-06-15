
import React from "react";
import { Order } from "@/hooks/admin/use-orders-data";
import DashboardStatsGrid from "./DashboardStatsGrid";
import DashboardCharts from "./DashboardCharts";
import RecentOrders from "./RecentOrders";
import QuickActionsCard from "./QuickActionsCard";
import { Clock } from "lucide-react";

interface DashboardContentProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
  onTabChange?: (tab: string) => void;
}

const DashboardContent = ({ orders, onSelectOrder, onTabChange }: DashboardContentProps) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cantinho-navy via-cantinho-cornflower to-cantinho-terracotta rounded-xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Bem-vindo ao Painel Administrativo
            </h1>
            <p className="text-cantinho-offwhite/90 text-sm sm:text-base">
              Gerencie seu restaurante de forma eficiente e intuitiva
            </p>
          </div>
          <div className="flex items-center gap-2 text-cantinho-offwhite/80">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Última atualização: {new Date().toLocaleTimeString('pt-AO')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStatsGrid orders={orders} />

      {/* Charts Section */}
      <DashboardCharts orders={orders} />

      {/* Quick Actions */}
      {onTabChange && <QuickActionsCard onTabChange={onTabChange} />}

      {/* Recent Orders Section */}
      <RecentOrders 
        orders={orders}
        onSelectOrder={onSelectOrder}
      />
    </div>
  );
};

export default DashboardContent;
