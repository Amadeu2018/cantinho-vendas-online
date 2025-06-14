
import React from "react";
import { Order } from "@/hooks/admin/use-orders-data";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardStatsGrid from "./dashboard/DashboardStatsGrid";
import DashboardCharts from "./dashboard/DashboardCharts";
import DashboardTabs from "./dashboard/DashboardTabs";
import DashboardContent from "./dashboard/DashboardContent";
import DashboardRefresh from "./dashboard/DashboardRefresh";

interface AdminDashboardProps {
  orders: Order[];
  fetchingOrders: boolean;
  onSelectOrder: (orderId: string) => void;
  onPrepareInvoice: (order: Order) => void;
  onLogout: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminDashboard = ({ 
  orders, 
  fetchingOrders, 
  onSelectOrder, 
  onPrepareInvoice,
  onLogout,
  activeTab = "dashboard",
  onTabChange
}: AdminDashboardProps) => {
  const { handleRefresh, isRefreshing } = DashboardRefresh({ 
    onRefresh: async () => {
      // Refresh logic here if needed
    }
  });

  return (
    <div className="space-y-8">
      <DashboardHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      
      <DashboardStatsGrid orders={orders} />
      
      {activeTab === "dashboard" && (
        <DashboardCharts orders={orders} />
      )}
      
      <DashboardTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        orders={orders}
        fetchingOrders={fetchingOrders}
        onSelectOrder={onSelectOrder}
      >
        <DashboardContent 
          orders={orders}
          onSelectOrder={onSelectOrder}
        />
      </DashboardTabs>
    </div>
  );
};

export default AdminDashboard;
