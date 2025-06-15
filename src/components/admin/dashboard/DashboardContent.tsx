
import React from "react";
import { Order } from "@/hooks/admin/use-orders-data";
import DashboardStatsGrid from "./DashboardStatsGrid";
import DashboardCharts from "./DashboardCharts";
import RecentOrders from "./RecentOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";

interface DashboardContentProps {
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
}

const DashboardContent = ({ orders, onSelectOrder }: DashboardContentProps) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cantinho-navy via-cantinho-cornflower to-cantinho-terracotta rounded-xl p-6 sm:p-8 text-white shadow-lg">
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
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-cantinho-terracotta" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Estatísticas em Tempo Real
          </h2>
        </div>
        <DashboardStatsGrid orders={orders} />
      </div>

      {/* Charts Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-cantinho-terracotta" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Análise de Performance
          </h2>
        </div>
        <DashboardCharts orders={orders} />
      </div>

      {/* Recent Orders Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-cantinho-terracotta" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Atividade Recente
          </h2>
        </div>
        <RecentOrders 
          orders={orders}
          onSelectOrder={onSelectOrder}
        />
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-cantinho-sky/10 to-cantinho-sage/10 border-cantinho-sage/20">
        <CardHeader>
          <CardTitle className="text-cantinho-navy flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-left border border-gray-200 hover:border-cantinho-terracotta/30">
              <div className="text-sm font-medium text-gray-900">Novo Pedido</div>
              <div className="text-xs text-gray-500 mt-1">Criar pedido manual</div>
            </button>
            <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-left border border-gray-200 hover:border-cantinho-terracotta/30">
              <div className="text-sm font-medium text-gray-900">Relatório</div>
              <div className="text-xs text-gray-500 mt-1">Gerar relatório</div>
            </button>
            <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-left border border-gray-200 hover:border-cantinho-terracotta/30">
              <div className="text-sm font-medium text-gray-900">Inventário</div>
              <div className="text-xs text-gray-500 mt-1">Verificar estoque</div>
            </button>
            <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-left border border-gray-200 hover:border-cantinho-terracotta/30">
              <div className="text-sm font-medium text-gray-900">Clientes</div>
              <div className="text-xs text-gray-500 mt-1">Gerenciar clientes</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
